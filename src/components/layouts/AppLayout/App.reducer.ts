'use client';
import { reducer } from './App.constants';


function appReducer(prevState, action) {
  switch (action.type) {
    case reducer.CHANGE_THEME: {
      return { ...prevState, darkMode: !prevState.darkMode };
    }
    case reducer.CHANGE_LANGUAGE: {
      return { ...prevState, language: prevState.language === 'id' ? 'en' : 'id' };
    }
    case reducer.UPDATE_USER_DATA: {
      const {
        currentRole,
        currentPosition,
        userData,
      } = action.data;

      return { ...prevState, currentPosition, currentRole, userData };
    }
    case reducer.UPDATE_IDENTITY: {
      return { ...prevState, identity: action.data };
    }
    case reducer.SET_PROCESS_ID: {
      return {
        ...prevState,
        identity: {
          ...prevState.identity,
          processId: action.data,
        },
      };
    }
    case reducer.SET_PARENT_ID: {
      return {
        ...prevState,
        identity: {
          ...prevState.identity,
          parentId: action.data,
        },
      };
    }
    case reducer.SET_ANALYST_ID: {
      return {
        ...prevState,
        identity: {
          ...prevState.identity,
          analystId: action.data,
        },
      };
    }
    case reducer.SET_DEBTOR_ID: {
      return {
        ...prevState,
        identity: {
          ...prevState.identity,
          debtorId: action.data,
        },
      };
    }
    case reducer.SET_FACILITY_ID: {
      return {
        ...prevState,
        identity: {
          ...prevState.identity,
          facilityId: action.data,
        },
      };
    }
    case reducer.SET_CHILD_ID: {
      return {
        ...prevState,
        identity: {
          ...prevState.identity,
          childId: action.data,
        },
      };
    }
    case reducer.SET_DEBTOR_NAME: {
      return {
        ...prevState,
        identity: {
          ...prevState.identity,
          debiturName: action.data,
        },
      };
    }
    case reducer.SET_VIEW_ONLY: {
      return {
        ...prevState,
        viewOnly: action.data,
      };
    }
    case reducer.SET_STEPPER: {
      return {
        ...prevState,
        stepper: action.data,
      };
    }
    case reducer.SET_PAGES: {
      return {
        ...prevState,
        pages: action.data,
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

export default appReducer;
