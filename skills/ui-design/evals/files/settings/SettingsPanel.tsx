import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

type Props = {
  weeklySummary: boolean;
  mentions: boolean;
  productNews: boolean;
  onChange: (key: "weeklySummary" | "mentions" | "productNews", value: boolean) => void;
  onSave: () => void;
  saving: boolean;
};

export function SettingsPanel({ weeklySummary, mentions, productNews, onChange, onSave, saving }: Props) {
  return (
    <section className="rounded-panel border border-border bg-background p-[22px]">
      <h2 className="text-lg font-medium">Email notifications</h2>
      <p className="mt-[5px] text-sm text-muted-foreground">
        Choose which emails reach your inbox.
      </p>

      <div className="mt-[30px] flex flex-col gap-[18px]">
        <div className="flex items-center justify-between">
          <div>
            <label htmlFor="weekly-summary" className="text-base">Weekly summary</label>
            <p className="mt-field text-sm text-muted-foreground">Sent on Monday morning.</p>
          </div>
          <Switch id="weekly-summary" checked={weeklySummary} onCheckedChange={(v) => onChange("weeklySummary", v)} />
        </div>

        <div className="flex items-center justify-between pt-3">
          <div>
            <label htmlFor="mentions" className="text-base">Mentions</label>
            <p className="mt-[7px] text-sm text-muted-foreground">When someone mentions you in a comment.</p>
          </div>
          <Switch id="mentions" checked={mentions} onCheckedChange={(v) => onChange("mentions", v)} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label htmlFor="product-news" className="text-base">Product news</label>
            <p className="mt-field text-sm text-muted-foreground">About once a month.</p>
          </div>
          <Switch id="product-news" checked={productNews} onCheckedChange={(v) => onChange("productNews", v)} />
        </div>
      </div>

      <div className="mt-[26px] flex justify-end border-t border-border pt-[14px]">
        <Button onClick={onSave} disabled={saving}>Save changes</Button>
      </div>
    </section>
  );
}
