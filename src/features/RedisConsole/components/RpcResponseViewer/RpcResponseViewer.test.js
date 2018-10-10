/* eslint-disable react/react-in-jsx-scope,no-undef */
import { RpcResponseViewer } from './RpcResponseViewer';
import { RpcResult } from './RpcResult';
import { RpcError } from './RpcError';


describe('<RpcResponseViewer />', () => {
  it('should render Response.Result', () => {
    const resultResponse = {
      result: 1
    };
    const wrapper = shallow(<RpcResponseViewer response={ resultResponse } />);
    expect(wrapper.containsMatchingElement(<RpcResult />)).toEqual(true);
  });


  it('should render Response.Error', () => {
    const errorResponse = {
      error: {
        message: 'test',
        data: []
      }
    };
    const wrapper = shallow(<RpcResponseViewer response={ errorResponse } />);
    expect(wrapper.containsMatchingElement(<RpcError />)).toEqual(true);
  });

  it('should show a placeholder message if there is no result or error', () => {
    const wrapper = shallow(<RpcResponseViewer response={ {nothing: 1} } />);
    expect(wrapper.containsMatchingElement(<RpcResult />)).toEqual(false);
    expect(wrapper.containsMatchingElement(<RpcError />)).toEqual(false);
  });
});
