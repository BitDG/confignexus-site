# Python Formula Integration

Changed the character EXP formula and now have to manually refresh thousands of cells? Tweaked the attack-power algorithm and one change ripples through everything? Python Formula Integration lets you write complex calculation logic as a Python function and attach it to cells — just like an Excel formula, when a dependency cell changes, all downstream cells **recalculate automatically**. Complex numeric rules in a single line.

It's a different feature from the "Python Script Editor" (hand-written script batch processing) — two distinct things:

| Aspect | Python Script Editor | Python Formula Integration (this page) |
|------|------------------|----------------------|
| Trigger | Manually click "Run" | Write a formula in a cell; it computes automatically |
| Purpose | One-off batch processing | Continuously active calculation logic |
| Cache | No cache | SmartCache caches automatically |
| Batch optimization | No optimization | BatchExecutor merges automatically |

> [!IMPORTANT]
> This is a ConfigNexus Pro feature, available after purchase on Steam.

## Quick Start

1. Open the Python Script Editor and write a function:

   ```python
   def calc_exp(level):
       return level ** 2 * 100
   ```

2. Register it with the formula system (the **Register as Formula** button at the top of the editor)

3. In any cell, write:

   ```
   =calc_exp(A2)
   ```

   When A2 = 5, this cell auto-computes 2500. Change A2 → this cell recalculates automatically.

video:Res/en/videos/公式集成-重算.webm|Register a Python function as a formula → write the formula in a cell → it recalculates automatically when a dependency changes

## Register as a Formula

The **Register as Formula** button at the top of the script editor → choose the function to register → give it a formula name (defaults to the function name).

Once registered, the function lives permanently in the formula system and is usable across projects (default scope); you can also designate it as "this project only."

## SmartCache

Same input → same output → no recomputation:

- Cache key: `function_name(serialized arguments)`
- LRU policy: the 1000 most recently used results are cached in memory
- TTL: 5 minutes by default; clear manually when the underlying data changes

The effect: a table where 10,000 cells call the same function with mostly repeated arguments → actually computes only a few dozen times.

## BatchExecutor

When a batch of cells calls the same function, the system merges the requests automatically:

- Detects N identical function calls within 10ms → merges them into a single Python process call
- The Python function receives an array of arguments → returns an array of results → distributed back to each cell

The effect: cells calling one by one would normally be N round-trips to the Python process → it actually does just 1 round-trip. Bulk recalculation of large tables drops from minutes to seconds.

> [!TIP]
> Your Python function **doesn't need to know** about batch optimization. The system decides automatically whether "this function can be batched" — side-effect-free pure functions get batched, functions with I/O get called one at a time.

## What You Can Write in a Cell

- Basic call: `=my_func(A1)`
- Nested: `=my_func(other_func(A1, B1))`
- Mixed with built-in formulas: `=SUM(my_func(A1:A10))` (note: when passing a range, the function must support array arguments)
- String literals: `=lookup('item', 'id', A1)`

## Function Signature Conventions

A function registered as a formula must:

1. **Be side-effect-free** (no writing files, no changing global state)
2. **Return a basic type** (int / float / str / bool / list / dict) — not objects / class instances
3. **Have a fixed argument order** (formula calls pass arguments positionally; keyword arguments aren't supported)

Functions that don't comply are warned at registration time and error at runtime.

## Error Handling

If Python throws an exception inside a formula → the cell shows `#ERR!`, and hovering shows the exception details:

```
#ERR! ZeroDivisionError: division by zero
  at calc_exp(level=0)
```

## Persistent Script Library

Registered formula functions are saved automatically to the **Script Library**:

- Main window menu → **Tools → Script Library**
- See the list of all registered functions
- Enable / disable / delete
- Reuse across projects (default-scope functions are usable in every project)

See the tutorial [[Persistent Script Library]].

## Performance Benchmarks

| Scenario | No cache / no batch | SmartCache + BatchExecutor |
|------|---------------|---------------------------|
| 5000 cell calls, identical arguments | 5000 Python calls | 1 (4999 cache hits) |
| 5000 cell calls, all different arguments | 5000 Python calls | 5 (1000 per batch) |
| 5000 cell calls, 80% repeated | 5000 | ~1 (all duplicates cached) |

> [!WARNING]
> **Don't** write `time.sleep` / network I/O / file I/O inside a function — it slows down recalculation of the whole table. Put that kind of operation in the "Script Editor" and run it manually.

## What to Learn Next

- Reuse registered formula functions across projects → [[Persistent Script Library]]
- Write a script to bulk-modify data once → [[Python Script Editor]]
- See all supported formats and the export flow → [[Data Export]]
