import { gql } from "@apollo/client";

const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      success
      message
      user {
        id
        email
        first_name
        last_name
        role
        is_active
        created_at
        updated_at
      }
    }
  }
`;

const ADD_SCHOOL = gql`
  mutation AddSchool($payload: SchoolInput!) {
    addSchool(payload: $payload) {
      success
      message
    }
  }
`;

const ADD_SCHOOL_PERIODIC_OBSERVATION = gql`
  mutation Add_school_periodic_observation(
    $payload: SchoolPeriodicObservationInput!
  ) {
    add_school_periodic_observation(payload: $payload) {
      message
      success
    }
  }
`;

export { ADD_SCHOOL, ADD_SCHOOL_PERIODIC_OBSERVATION, LOGIN_USER };
