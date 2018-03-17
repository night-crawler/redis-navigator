/* eslint-disable react/react-in-jsx-scope,no-undef */
import Response from './Response';
import Result from './Result';
import Error from './Error';


describe('Response', () => {
    it('should render Response.Result', () => {
        const resultResponse = {
            result: 1
        };
        const wrapper = shallow(<Response response={ resultResponse } />);
        expect(wrapper.containsMatchingElement(<Result />)).toEqual(true);
    });


    it('should render Response.Error', () => {
        const errorResponse = {
            error: {
                message: 'test',
                data: []
            }
        };
        const wrapper = shallow(<Response response={ errorResponse } />);
        expect(wrapper.containsMatchingElement(<Error />)).toEqual(true);
    });

    it('should show a placeholder message if there is no result or error', () => {
        const wrapper = shallow(<Response response={ {nothing: 1} } />);
        expect(wrapper.containsMatchingElement(<Result />)).toEqual(false);
        expect(wrapper.containsMatchingElement(<Error />)).toEqual(false);
    });
});
