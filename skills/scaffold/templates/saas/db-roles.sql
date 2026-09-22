-- Two roles. The migration role owns tables and runs `prisma migrate`; the app
-- role is what every running process connects as. Superusers and BYPASSRLS
-- roles skip every policy, and table owners skip them unless FORCE is set, so
-- the app must never connect as the owner.
CREATE ROLE {{db_migrator}} LOGIN PASSWORD :'migrator_password';
CREATE ROLE {{db_app}} LOGIN PASSWORD :'app_password' NOSUPERUSER NOBYPASSRLS;

GRANT USAGE ON SCHEMA public TO {{db_app}};
ALTER DEFAULT PRIVILEGES FOR ROLE {{db_migrator}} IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO {{db_app}};

-- Per tenant-scoped table, in the migration that creates it:
-- ALTER TABLE lesson ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE lesson FORCE ROW LEVEL SECURITY;
-- CREATE POLICY lesson_tenant ON lesson FOR ALL TO {{db_app}}
--   USING (tenant_id = current_setting('app.tenant_id', true)::uuid)
--   WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::uuid);

-- Cold-clone assertion: both columns false for the app role, and it owns nothing.
-- SELECT rolname, rolsuper, rolbypassrls FROM pg_roles WHERE rolname = '{{db_app}}';
-- SELECT tablename FROM pg_tables WHERE tableowner = '{{db_app}}';
