// Update the client ID and search app ID for your deployment.
// [START cloud_search_github_tutorial_search_config]
let searchConfig = {
  clientId: "[client-id]",
  searchAppId: "searchapplications/[application-id]"
};
// [END cloud_search_github_tutorial_search_config]

// Reference to the results container to clear results on login/logout changes.
let resultsContainer;

/**
 * Load the cloud search widget & auth libraries. Runs after
 * the initial gapi bootstrap library is ready.
 */
 // [START cloud_search_github_tutorial_esw_load]
function onLoad() {
  gapi.load('client:auth2:cloudsearch-widget', initializeApp)
}
// [END cloud_search_github_tutorial_esw_load]

/**
 * Initialize the app after loading the Google API client &
 * Cloud Search widget.
 */
 // [START cloud_search_github_tutorial_init_app]
async function initializeApp() {
  await gapi.auth2.init({
      'clientId': searchConfig.clientId,
      'scope': 'https://www.googleapis.com/auth/cloud_search.query'
  });

  // [START cloud_search_github_tutorial_init_auth]
  let auth = gapi.auth2.getAuthInstance();

  // Watch for sign in status changes to update the UI appropriately
  let onSignInChanged = (isSignedIn) => {
    document.getElementById("app").hidden = !isSignedIn;
    document.getElementById("welcome").hidden = isSignedIn;
    if (resultsContainer) {
      resultsContainer.clear();
    }
  }
  auth.isSignedIn.listen(onSignInChanged);
  onSignInChanged(auth.isSignedIn.get()); // Trigger with current status

  // Connect sign-in/sign-out buttons
  document.getElementById("sign-in").onclick = (e) =>  auth.signIn();
  document.getElementById("sign-out").onclick = (e) => auth.signOut();
  // [END cloud_search_github_tutorial_init_auth]

  // [START cloud_search_github_tutorial_init_widget]
  gapi.config.update('cloudsearch.config/apiVersion', 'v1');
  resultsContainer = new gapi.cloudsearch.widget.resultscontainer.Builder()
    .setSearchApplicationId(searchConfig.searchAppId)
    .setSearchResultsContainerElement(document.getElementById('search_results'))
    .setFacetResultsContainerElement(document.getElementById('facet_results'))
    .build();

  const searchBox = new gapi.cloudsearch.widget.searchbox.Builder()
    .setSearchApplicationId(searchConfig.searchAppId)
    .setInput(document.getElementById('search_input'))
    .setAnchor(document.getElementById('suggestions_anchor'))
    .setResultsContainer(resultsContainer)
    .build();
  // [END cloud_search_github_tutorial_init_widget]
}
// [END cloud_search_github_tutorial_init_app]
