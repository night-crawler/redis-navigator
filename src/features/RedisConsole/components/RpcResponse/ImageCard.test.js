/* eslint-disable react/react-in-jsx-scope,no-undef */
import ImageCard from './ImageCard';


describe('ImageCard', () => {
    it('should render ImageCard', () => {
        const wrapper = shallow(<ImageCard dataUri='1' />);
        expect(wrapper).toMatchSnapshot();
    });
});
