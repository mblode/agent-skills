'use strict';

const test = require('node:test');
const { RuleTester } = require('eslint');

// Run RuleTester synchronously under `node --test`: each call throws on the
// first failing case, which fails the enclosing node:test.
RuleTester.describe = function (text, fn) {
  return fn.call(this);
};
RuleTester.it = function (text, fn) {
  return fn.call(this);
};
RuleTester.itOnly = function (text, fn) {
  return fn.call(this);
};

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});

const load = (name) => require(`../rules/${name}`);

test('prefer-radio-for-few-options', () => {
  ruleTester.run('prefer-radio-for-few-options', load('prefer-radio-for-few-options'), {
    valid: [
      {
        code: '<Select><option>a</option><option>b</option><option>c</option><option>d</option></Select>',
      },
      { code: '<Select>{items.map((i) => <option>{i}</option>)}</Select>' },
      { code: '<div><option>a</option><option>b</option></div>' },
    ],
    invalid: [
      {
        code: '<Select><option>a</option><option>b</option></Select>',
        errors: [{ messageId: 'preferRadio' }],
      },
      {
        code: '<Select><option>a</option><option>b</option><option>c</option></Select>',
        errors: [{ messageId: 'preferRadio' }],
      },
    ],
  });
});

test('no-nested-modals', () => {
  ruleTester.run('no-nested-modals', load('no-nested-modals'), {
    valid: [
      { code: '<Modal><Modal.Body>content</Modal.Body></Modal>' },
      { code: '<><Modal>a</Modal><Modal>b</Modal></>' },
    ],
    invalid: [
      {
        code: '<Modal><Modal>inner</Modal></Modal>',
        errors: [{ messageId: 'noNested' }],
      },
      {
        code: '<Dialog><div><Dialog>inner</Dialog></div></Dialog>',
        errors: [{ messageId: 'noNested' }],
      },
    ],
  });
});

test('icon-button-accessible-name', () => {
  ruleTester.run('icon-button-accessible-name', load('icon-button-accessible-name'), {
    valid: [
      { code: '<button aria-label="Close"><Icon /></button>' },
      { code: '<Button>Save changes</Button>' },
      { code: '<button>{label}</button>' },
      { code: '<IconButton title="Edit"><EditIcon /></IconButton>' },
    ],
    invalid: [
      { code: '<button><Icon /></button>', errors: [{ messageId: 'needsName' }] },
      { code: '<IconButton><svg /></IconButton>', errors: [{ messageId: 'needsName' }] },
      { code: '<button></button>', errors: [{ messageId: 'needsName' }] },
    ],
  });
});

test('no-design-system-override', () => {
  ruleTester.run('no-design-system-override', load('no-design-system-override'), {
    valid: [
      {
        code: '<Button className="mt-4 w-full">Save</Button>',
        options: [{ components: ['Button'] }],
      },
      { code: '<div className="bg-red-500 rounded-full">x</div>', options: [{ components: ['Button'] }] },
      { code: '<Button className="bg-red-500">x</Button>' },
    ],
    invalid: [
      {
        code: '<Button className="bg-red-500 rounded-full shadow-lg mt-4">x</Button>',
        options: [{ components: ['Button'] }],
        errors: [{ messageId: 'override' }],
      },
    ],
  });
});

test('require-modal-body', () => {
  ruleTester.run('require-modal-body', load('require-modal-body'), {
    valid: [
      { code: '<Modal><Modal.Body><p>content</p></Modal.Body></Modal>' },
      { code: '<Modal />' },
      { code: '<Dialog><Dialog.Body>x</Dialog.Body></Dialog>' },
    ],
    invalid: [
      {
        code: '<Modal><div>long content here</div></Modal>',
        errors: [{ messageId: 'needsBody' }],
      },
    ],
  });
});

test('no-raw-shadow', () => {
  ruleTester.run('no-raw-shadow', load('no-raw-shadow'), {
    valid: [
      { code: '<div className="shadow-none p-4">x</div>' },
      { code: '<div className="rounded-lg">x</div>' },
    ],
    invalid: [
      { code: '<div className="shadow-lg">x</div>', errors: [{ messageId: 'rawShadow' }] },
      { code: '<Card className="p-4 shadow">x</Card>', errors: [{ messageId: 'rawShadow' }] },
    ],
  });
});

test('off-grid-spacing', () => {
  ruleTester.run('off-grid-spacing', load('off-grid-spacing'), {
    valid: [
      { code: '<div className="p-[16px] mt-[8px]">x</div>' },
      { code: '<div className="p-4 gap-2">x</div>' },
      { code: '<div className="w-[13px]">x</div>' },
    ],
    invalid: [
      { code: '<div className="p-[13px]">x</div>', errors: [{ messageId: 'offGrid' }] },
      { code: '<div className="mt-[7px] gap-[10px]">x</div>', errors: [{ messageId: 'offGrid' }] },
    ],
  });
});
