// Clear data from previous runs.
alterState(state => {
  state.data = {};
  state.references = [];
  return state;
});

// GET new Primero cases
// User Story 1: Generating government referrals
getCases(
  {
    remote: true,
    scope: {
      /*transitions_created_at: `date_range||${
          state.lastCreated || '01-01-2020'
        }.01-01-4020`,*/
      or: {
        //TO DISCUSS --> date filters, OR operator
        transitions_created_at: `or_op||date_range||${
          state.lastCreated || '03-06-2020'
        }.01-01-4020`,
        transitions_changed_at: `or_op||date_range||${
          state.lastUpdated || '03-06-2020 00:00'
        }.01-01-4020 00:00`,
      },
      service_response_types: 'list||referral_to_oscar',
    },
  },
  state => {
    console.log(
      `Primero API responded with cases: ${JSON.stringify(
        state.data.map(x => x.case_id_display)
      )}`
    );

    state.data.forEach(x => {
      function assertExists(prop) {
        x.hasOwnProperty(prop) || error(prop);
      }

      function error(prop) {
        throw `Primero API violated contract on the '${prop}' property.
        Please contact _____@primero.org'`;
      }

      assertExists('owned_by');
      assertExists('owned_by_agency');
      assertExists('owned_by_phone');
      assertExists('module_id');
      assertExists('created_at');
      assertExists('case_id_display');
      assertExists('mosvy_number');
      assertExists('oscar_number');
      assertExists('name_first');
      assertExists('name_last');
      assertExists('sex');
      assertExists('date_of_birth');
      assertExists('location_current');
      assertExists('services_section');
      assertExists('transitions');
      assertExists('_id');
      assertExists('case_id');
      assertExists('protection_status');
      assertExists('transitions_changed_at');

      Array.isArray(x.transitions) || error('transitions');
      Array.isArray(x.services_section) || error('services_section');
    });

    // Get latest transition from all cases.
    const creationDates = state.data
      .map(x => {
        // Get latest transition from a single case
        return x.transitions.map(t => t.created_at).sort((a, b) => b - a)[0];
      })
      .sort((a, b) => b - a);

    const lastCreationParts = creationDates[0] && creationDates[0].split('/');

    if (lastCreationParts) {
      console.log("Found cases, updating 'last created case' date.");
      state.lastCreated = `${lastCreationParts[2]}-${lastCreationParts[1]}-${lastCreationParts[0]}`;
    }

    const updateDates = state.data
      // Do we need to check for transitions_changed_at date specifically? It
      // seems like transitions_changed_at should be the ONLY cursor we use.
      .filter(x => x.transitions_changed_at)
      .map(x => x.transitions_changed_at)
      .sort((a, b) => b - a);

    const lastUpdateParts = updateDates[0] && updateDates[0].split('/');

    if (lastUpdateParts) {
      console.log(`Found cases, updating 'last updated case' date.`);
      state.lastUpdated = `${lastCreationParts[2]}-${lastCreationParts[1]}-${lastCreationParts[0]}`;
    }

    console.log('The last transition update is: ' + state.lastUpdated);
    console.log('The last transition creation is: ' + state.lastCreated);

    return state;
  }
);
