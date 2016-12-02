import * as LocationActionCreators from './LocationActionCreators';
import * as UserActionCreators from './UserActionCreators';
import * as PlaceActionCreators from './PlaceActionCreators';
import * as MessageActionCreators from './MessageActionCreators';

import { bindActionCreators } from 'redux';

export default function(dispatch){ 
    let locationActions = bindActionCreators(LocationActionCreators, dispatch);
    return {
       ...bindActionCreators(LocationActionCreators, dispatch),
       ...bindActionCreators(UserActionCreators, dispatch),
       ...bindActionCreators(PlaceActionCreators, dispatch),
       ...bindActionCreators(MessageActionCreators, dispatch)
    }
}
