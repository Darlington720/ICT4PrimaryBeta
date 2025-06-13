import { gql } from "@apollo/client";

const ADD_SCHOOL = gql`
  mutation AddSchool($payload: SchoolInput!) {
    addSchool(payload: $payload) {
      success
      message
    }
  }
`;

const ADD_SCHOOL_PERIODIC_OBSERVATION = gql`
  mutation Add_school_periodic_observation($payload: SchoolPeriodicObservationInput!) {
  add_school_periodic_observation(payload: $payload) {
    message
    success
  }
}
`

export { ADD_SCHOOL, ADD_SCHOOL_PERIODIC_OBSERVATION };
