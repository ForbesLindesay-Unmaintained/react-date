'use strict';

const fs = require('fs');
const semver = require('semver');
const spawn = require('cross-spawn').sync;

const reactVersion = require('react/package.json').version;


const adapters = [
  {react: '^16.0.0', enzyme: 'enzyme-adapter-react-16'},
  {react: '^15.5.0', enzyme: 'enzyme-adapter-react-15'},
  {react: '15.0.0-0 - 15.4.x', enzyme: 'enzyme-adapter-react-15.4'},
  {react: '^0.14.0', enzyme: 'enzyme-adapter-react-14'},
  {react: '^0.13.0', enzyme: 'enzyme-adapter-react-13'},
];

// we test with multiple different versions of our react
// peerDependency, so we must install the appropriate companion
// libraries to go with the selected react version.

adapters.forEach(adapter => {
  if (semver.satisfies(reactVersion, adapter.react)) {
    const {status} = spawn(
      'npm',
      [
        'install',
        '--save-dev',
        adapter.enzyme,
        'react-dom@' + reactVersion,
      ],
      {stdio: 'inherit'}
    );
    if (status) {
      process.exit(1);
    }
    fs.writeFileSync(
      __dirname + '/src/__tests__/index.test.js',
      fs.readFileSync(
        __dirname + '/src/__tests__/index.test.js',
        'utf8'
      ).replace(/enzyme-adapter-react-16/g, adapter.enzyme)
    );
  }
});
