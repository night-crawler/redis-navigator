/* eslint-disable react/react-in-jsx-scope,no-undef */
import { TextareaSpoiler } from '.';


describe('<TextareaSpoiler>', () => {
  it('should render shown TextareaSpoiler', () => {
    const wrapper = shallowWithIntl(<TextareaSpoiler result='result' show={ true } />);
    expect(wrapper).toMatchSnapshot();

    // intl fails with .html()
    // expect(wrapper.html()).toMatch(/textarea/i);
    expect(wrapper.find('.response-data')).toHaveLength(1);

    wrapper.find('.hide-shown').simulate('click');
    expect(wrapper.find('.show-hidden')).toHaveLength(1);
  });

  it('should render hidden TextareaSpoiler', () => {
    const wrapper = shallowWithIntl(<TextareaSpoiler result='result' show={ false } />);
    expect(wrapper).toMatchSnapshot();

    expect(wrapper.find('.response-data')).toHaveLength(0);
    // expect(wrapper.html()).not.toMatch(/textarea/i);

    wrapper.find('.show-hidden').simulate('click');
    expect(wrapper.find('.hide-shown')).toHaveLength(1);
  });
});
