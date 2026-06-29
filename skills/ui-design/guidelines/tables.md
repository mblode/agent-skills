# Tables

Covers: data tables, comparison tables, table headings, row dividers, horizontal scrolling tables, table containers.

## Design Rules

- Never use uppercase in table headings: use sentence case.
- Never let table headings wrap: add `whitespace-nowrap` to `<th>`.
- Never put tables in containers or cards: place them directly on the background.
- Divide rows with horizontal lines only: no vertical lines, no outer borders.
- Always use `w-full` so tables fill their container.
- Hide headings with `sr-only` when column content is self-explanatory (typically 2-3 column tables where headings add no value).
- Make tables responsive when all columns won't fit on small screens, using a two-div wrapper:
  - Outer div: `overflow-x-auto whitespace-nowrap` with negative margins: horizontal margins cancel the page container's padding (e.g. `-mx-4 sm:-mx-6 lg:-mx-8`), vertical margin always `-my-2`.
  - Inner div: `inline-block min-w-full align-middle` with horizontal padding matching the container's (e.g. `px-4 sm:px-6 lg:px-8`) and `py-2`.
  - Always match the negative horizontal margins and horizontal padding to the container padding actually used in the page layout.

  ```html
  <!-- Example assumes container padding of px-4 sm:px-6 lg:px-8 -->
  <div class="-mx-4 -my-2 overflow-x-auto whitespace-nowrap sm:-mx-6 lg:-mx-8">
    <div class="inline-block min-w-full px-4 py-2 align-middle sm:px-6 lg:px-8">
      <table>
        …
      </table>
    </div>
  </div>
  ```
