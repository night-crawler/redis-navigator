/* eslint-disable react/react-in-jsx-scope,no-undef */
import Response from './Response';
import Result from './Result';
import Error from './Error';


describe('Response', () => {
    it('should render Response.Result', () => {
        const wrapper = shallow(
            <Response
                response={ {
                    result: 1
                } }
            />
        );
        expect(wrapper).toMatchSnapshot();
        expect(wrapper.containsMatchingElement(<Result />)).toEqual(true);
    });


    it('should render Response.Error', () => {
        const wrapper = shallow(
            <Response
                response={ {
                    error: {
                        message: 'test',
                        data: []
                    }
                } }
            />
        );
        expect(wrapper).toMatchSnapshot();
        expect(wrapper.containsMatchingElement(<Error />)).toEqual(true);
    });

});
