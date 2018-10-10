import ReactJson from 'react-json-view';

import { RpcError } from './RpcError';


describe('Error', () => {
  it('should render ReactJson for error data array', () => {
    const wrapper = shallow(<RpcError error={ { data: [ 1, 2, 3] } } />);
    expect(wrapper.find(ReactJson)).toHaveLength(1);
  });

  it('should render ReactJson for error data object', () => {
    const wrapper = shallow(<RpcError error={ { data: { a: 1 } } } />);
    expect(wrapper.find(ReactJson)).toHaveLength(1);
  });

  it('should NOT render ReactJson for simple data types', () => {
    const wrapper = shallow(<RpcError error={ { data: '123' } } />);
    expect(wrapper.find(ReactJson)).toHaveLength(0);
  });
});
