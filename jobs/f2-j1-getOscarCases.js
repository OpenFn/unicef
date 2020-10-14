// Clear data from previous runs.
alterState(state => {
  state.data = {};
  state.references = [];
  console.log(`lastQueryDate (from the previous run): ${state.lastQueryDate}`);
  state.thisQueryDate = new Date().toISOString().replace('T', ' ').slice(0, 19);
  console.log(
    `Current time, to be used to update lastQueryDate after this query: ${state.thisQueryDate}`
  );
  return state;
});

// GET new OSCaR cases
// User Story 2: 'View Oscar cases in Primero' AND User Story 4: 'Sending referrals to Primero'
post(
  //Oscar authentication  --> To update?
  '/api/v1/admin_auth/sign_in',
  {
    keepCookie: true,
    body: {
      email: state.configuration.username,
      password: state.configuration.password,
    },
  },
  get(
    '/api/v1/organizations/clients',
    {
      keepCookie: true,
      headers: state => ({
        // Oscar authentication
        'access-token': state.data.__headers['access-token'],
        'Content-Type': 'application/json',
        client: state.data.__headers.client,
        uid: state.configuration.username,
      }),
      query: {
        since_date: '2020-10-14 00:00:00',
        //since_date: state.lastQueryDate || '2020-09-20 00:00:00', // since_date must always have 00:00:00 timestamp in order to return referrals! 
        //referred_external: true, //old query parameter - to remove to pull ALL cases, not just referrals
      },
    },
    state => {
      console.log(
        `Oscar API responded with cases with global_ids: ${JSON.stringify(
          state.data.data ? state.data.data.map(c => c.global_id) : ''
        )}`
      );
      state.lastQueryDate = state.thisQueryDate;
      console.log(`Updated state.lastQueryDate to: ${state.lastQueryDate}`);
      return state;
    }
  )
);
