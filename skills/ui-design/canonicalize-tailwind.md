# Canonicalize Tailwind

Use this when the user wants to clean up, canonicalize, or normalize Tailwind class lists.

## Workflow

1. Identify Tailwind class strings in the requested files or components.
2. Canonicalize class strings with `npx @tailwindcss/cli canonicalize`.
3. Apply changed class strings back to the source.
4. Run the project's formatter or relevant checks when available.

## Commands

- Use `npx @tailwindcss/cli canonicalize` to clean up Tailwind class lists: collapses shorthands (`mt-2 mr-2 mb-2 ml-2` → `m-2`), resolves overrides (`py-3 p-1 px-3` → `p-3`), canonicalizes arbitrary values to named utilities, and sorts classes; pass `--css path/to/input.css` if the project uses a custom CSS entry file

  Single class string:

  ```sh
  npx @tailwindcss/cli canonicalize "mt-2 mr-2 mb-2 ml-2"
  # m-2
  ```

  Multiple class strings as positional args (each returned on its own line):

  ```sh
  npx @tailwindcss/cli canonicalize "py-3 p-1 px-3" "mt-2 mr-2 mb-2 ml-2"
  # p-3
  # m-2
  ```

  Pipe class strings via stdin (one per line):

  ```sh
  echo "py-3 p-1 px-3\nmt-2 mr-2 mb-2 ml-2" | npx @tailwindcss/cli canonicalize
  # p-3
  # m-2
  ```

  Use `--format json` or `--format jsonl` for structured output with `input`/`output`/`changed` fields:

  ```sh
  npx @tailwindcss/cli canonicalize --format json "py-3 p-1 px-3"
  # [{ "input": "py-3 p-1 px-3", "output": "p-3", "changed": true }]
  ```

  Use `--stream` to process stdin line-by-line without buffering:

  ```sh
  npx @tailwindcss/cli canonicalize --stream
  ```

## Verify

- Confirm class strings still express the same visual intent after canonicalization.
