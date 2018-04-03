import React from 'react';
import {configure, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ReactDate from '../';
configure({adapter: new Adapter()});

test('defaultValue', () => {
  const onChange = jest.fn();
  const onValid = jest.fn();
  const onInvalid = jest.fn();
  const el = mount(
    <ReactDate
      format="DD/MM/YYYY"
      defaultValue="2017-04-18"
      onChange={onChange}
      onValid={onValid}
      onInvalid={onInvalid}
    />
  );
  const input = el.find('input');
  expect(input.props().value).toBe('18/04/2017');

  // try changing to a different valid date
  input.simulate('change', {target: {value: '10/04/2017'}});
  // expect(input.props().value).toBe('10/04/20 17');
  expect(onChange.mock.calls.length).toBe(1);
  expect(onChange.mock.calls[0]).toEqual(
    [{target: {value: '2017-04-10'}}],
  );

  // try changing to a different invalid date
  input.simulate('change', {target: {value: 'not a date'}});
  // expect(input.props().value).toBe('not a date');
  // onChange does not yet get called
  expect(onChange.mock.calls.length).toBe(1);
  expect(onValid.mock.calls.length).toBe(0);
  expect(onInvalid.mock.calls.length).toBe(1);
});

// TODO: this needs a lot more test cases
