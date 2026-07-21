# Generate Python Scripts with AI

## What This Solves

If you cannot write Python from scratch, describe the processing goal and let AI draft a script or formula. Review it in the editor before running it.

## Steps

1. Open the Python script editor or formula editor.
2. Describe the input data, expected result, and constraints.
3. Generate the code.
4. Review the result before running it.
5. Test it on a small data range first.
6. Use it on the full table only after confirming the output.

## Example Request

> Read the `price` and `count` columns in the current worksheet and calculate `total=price*count`. Treat empty values as 0 and do not change any other column.

## Check Before Running

- Input and output fields actually exist.
- Empty values, text, and invalid data are handled.
- The modification range is correct.
- The code does not perform unexpected file, network, or system operations.
- Original data will not be overwritten unintentionally.

> [!warning]
> AI-generated code is still code. Read and approve it before running. Save the project or prepare a restorable copy before making bulk changes.

## Next

- Python editor basics: [[Python Script Editor]]
- Reuse scripts: [[Persistent Script Library]]
