'use strict';

const semver = require('semver');
const spawn = require('cross-spawn').sync;

const reactVersion = require('react/package.json').version;

// we test with multiple different versions of our react
// peerDependency, so we must install the appropriate companion
// libraries to go with the selected react version.

if (semver.satisfies(reactVersion, '^15.0.0')) {
  const {status} = spawn(
    'npm',
    [
      'install',
      'react-dom@' + reactVersion,
      'react-test-renderer@' + reactVersion,
    ],
    {stdio: 'inherit'}
  );
  if (status) {
    process.exit(1);
  }
}
if (semver.satisfies(reactVersion, '0.14.x')) {
  const {status} = spawn(
    'npm',
    [
      'install',
      'react-dom@' + reactVersion,
      'react-addons-test-utils@' + (
        reactVersion === '0.14.9'
        ? '0.14.8'
        : reactVersion
      ),
    ],
    {stdio: 'inherit'}
  );
  if (status) {
    process.exit(1);
  }
}
