/* eslint-disable react/react-in-jsx-scope,no-undef */
import ReactJsonCard from './ReactJsonCard';


describe('ReactJsonCard', () => {
    it('should render ReactJsonCard', () => {
        const result = { a: 1 };
        const wrapper = shallow(<ReactJsonCard result={ result } />);
        expect(wrapper).toMatchSnapshot();
    });
});
