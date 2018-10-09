/* eslint-disable react/react-in-jsx-scope,no-undef */
import NotFound from './NotFound';

describe('NotFound', () => {
  it('should render NotFound', () => {
    const wrapper = shallow(
      <NotFound message='lol' />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
