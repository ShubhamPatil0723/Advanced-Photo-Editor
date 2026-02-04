/**
 * Commitlint Configuration
 * Uses conventional commit format
 * https://www.conventionalcommits.org/
 */

import type { UserConfig } from '@commitlint/types';

const Configuration: UserConfig = {
  extends: ['@commitlint/config-conventional'],
};

export default Configuration;
