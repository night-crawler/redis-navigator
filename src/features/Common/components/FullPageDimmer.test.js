/* eslint-disable react/react-in-jsx-scope,no-undef */
import FullPageDimmer from './FullPageDimmer';

describe('FullPageDimmer', () => {
  it('should render FullPageDimmer', () => {
    const wrapper = shallow(
      <FullPageDimmer message='lol' />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
