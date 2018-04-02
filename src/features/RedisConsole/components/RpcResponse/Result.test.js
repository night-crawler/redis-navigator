import { TextareaSpoiler } from 'features/Common/components';
/* eslint-disable react/react-in-jsx-scope,no-undef */
import BooleanCard from './BooleanCard';
import ObjectTreeViewWidget from './ObjectTreeViewWidget';
import ImageCard from './ImageCard.jsx';
import Result, { StringCard } from './Result';


const GIF = '' +
    'R0lGODlhYABgAIABAAAAAP///yH5BAEKAAEALAAAAABgAGAAAAL+jI+py+0Po5y02ouz3rz7D4biSJbmiabqyrbuC8fyTNcqANguzuf63cP9UMHg' +
    'kFQsHj/Jpm+5cSYdPEMPilBmrwypEBvQJr5d73NpvJjPR67ajHVj4Gi5xglNd6Z5e1Tf5vdX1UfIJKhjeIhYwfjGtgc4J5lByWHZKHbnOKn4iJnp' +
    'GSkaCkphWkmW2jRIWqa6wAlB1wnbgIr6sLbpOmaaS0VbC6mgWSyru9Z7i8sJHKxsm+xMvSwRLQ1tnWt9zRf2vMVoHJttQRnu60p+bD4B6j6L3twt' +
    'Xz9cxTp9z8x/jm3PXzmBpfB4Q6aNGAgvpS4hdJjuAMF28UJEBFdxn0KfExMvSmRXKOMrjy9IYjTZgqRBMFYeqvvGcuJHfTFFjoRZR+auOC7FSQGj' +
    'cmdOmy9/Du2oh6YNnAezofQgrGk/maOEBtwIkgi2jUW1xdhaMWvLGWCvcl0K0CzLmQwjPN2h1G1PtETZ1l1r9i7eqXP33qTq12ffwEUBE245+LDg' +
    's4qvNm7F+HFCyav0Uj4Z+XI5zZw7e/4MOrTo0aRLnygAADs=';

const GIF_BIN = atob(GIF);


describe('Result', () => {
    it('should render Result.StringCard', () => {
        const wrapper = shallow(<Result result='1' />);
        expect(wrapper).toMatchSnapshot();
        expect(wrapper.containsMatchingElement(<StringCard result='1' />)).toEqual(true);
    });

    it('should render Result.BooleanCard', () => {
        const wrapper = shallow(<Result result={ true } />);
        expect(wrapper).toMatchSnapshot();
        expect(wrapper.containsMatchingElement(<BooleanCard result={ true } />)).toEqual(true);
    });

    it('should render Result.ObjectTreeViewWidget[Array]', () => {
        const wrapper = shallow(<Result result={ [1, 2, 3] } />);
        expect(wrapper).toMatchSnapshot();
        expect(wrapper.contains(<ObjectTreeViewWidget result={ [1, 2, 3] } />)).toEqual(true);
    });

    it('should render Result.ObjectTreeViewWidget[Object]', () => {
        const wrapper = shallow(<Result result={ { a: 1, b: 2, c: 3 } } />);
        expect(wrapper).toMatchSnapshot();
        expect(wrapper.contains(<ObjectTreeViewWidget result={ { a: 1, b: 2, c: 3 } } />)).toEqual(true);
    });

    it('should render null', () => {
        const wrapper = shallow(<Result result={ null } />);
        expect(wrapper).toMatchSnapshot();
        expect(wrapper.contains(<div>null</div>)).toEqual(true);
    });

    it('should render image', () => {
        const wrapper = shallow(<Result result={ GIF_BIN } />);
        expect(wrapper).toMatchSnapshot();
        expect(wrapper.find(ImageCard)).toHaveLength(1);
    });
});


describe('StringCard', () => {
    it('should render TextareaSpoiler for base64', () => {
        const wrapper = shallow(<StringCard result='buck' />);
        expect(wrapper.find(TextareaSpoiler)).toHaveLength(1);
    });
});