---
name: social-card
description: Generates the 1200x630 social share image for a Pebble Works blog post from its title and hero colour. Use when asked to "make the social card", "generate the og image", or "the share image is missing".
compatibility: Needs the inkwell MCP server from this repository's .mcp.json, and write access to the working tree.
---

# Social Card

Produce `public/og/<slug>.png` for a blog post.

## Before you start

This skill needs the `inkwell` MCP server. If `mcp__inkwell__generate_image` is not in your tool list, stop and say so: do not describe the image in words or draw it as SVG instead, because the blog template only accepts a PNG.

## Steps

1. Read the post's front matter in `content/blog/<slug>.mdx` for `title` and `heroColour`.
2. Call `mcp__inkwell__generate_image` with `width: 1200`, `height: 630`, `style: "pebble-flat"`, and a prompt that states the title text exactly and the hero colour as a hex value.
3. The tool writes the file under `design/generated/` and returns its path. Move it to `public/og/<slug>.png`.
4. Open the PNG and check the title is spelled exactly as in the front matter. Regenerate if any letter is wrong; do not ship a misspelled card.

## Gotchas

- `mcp__inkwell__edit_image` takes an existing PNG plus an instruction and returns a changed copy. Use it for "make the title smaller", not a fresh generation, so the layout stays the same.
- Titles over 60 characters wrap to three lines and collide with the logo. Ask for a shorter social title instead of shrinking the type.
