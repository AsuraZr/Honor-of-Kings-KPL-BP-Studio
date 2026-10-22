"""Desktop entry point for the packaged KPL BP Studio executable."""
from __future__ import annotations

import multiprocessing
import sys

from server import main


if __name__ == "__main__":
    multiprocessing.freeze_support()
    if "--open" not in sys.argv:
        sys.argv.append("--open")
    raise SystemExit(main())
