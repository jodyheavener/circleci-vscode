import { existsSync, mkdirSync, unlinkSync } from 'fs';
import { resolve } from 'path';

const localesDir = resolve('..', 'src', '18n');

if (!existsSync(localesDir)) {
  mkdirSync(localesDir);
}

// unlinkSync();
