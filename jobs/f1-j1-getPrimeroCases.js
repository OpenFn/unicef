// GET new Primero cases
// User Story 1: Generating government referrals
getCases({
  remote: true,
  scope: {
    transitions_created_at: `date_range||${state.lastFetch}.30-Mar-2020`, //>>Q: What should this date filter be?
    service_response_types: 'list||referral_to_oscar',
  },
});
