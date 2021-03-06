import React from "react"; // eslint-disable-line
import ISO6391 from "iso-639-1/build/index";

/* This function is duplicated from ../../src/utils but included here to
(a) keep server & client code seperate and (b) avoid any transpiling errors
during client building */
const parseNarrativeLanguage = (narrative) => {
  const urlParts = narrative.split("/");
  let language = urlParts[urlParts.length - 2];
  if (language === 'sit-rep') language = 'en';
  return language;
};

class LanguageSelector extends React.Component {
    state = {
      currentNarrative: undefined,
      availableNarratives: undefined
    }

    async getAvailableNarratives() {
      const response = await fetch("/charon/getAvailable");
      const available = await response.json();
      return available.narratives.map((n) => n.request);
    }

    getNarrativeLanguage(narrative) {
      const narrativeLanguage = parseNarrativeLanguage(narrative);
      return ISO6391.getNativeName(narrativeLanguage);
    }

    async componentDidMount() {
      const currentNarrative = window.location.pathname.replace(/^\//, '');
      const currentNarrativeDate = currentNarrative.split('/').pop();
      this.getAvailableNarratives().then((availableNarratives) => {
        const translatedNarratives = [];
        availableNarratives.forEach(narrative => {
          if (narrative.startsWith('narratives/ncov/sit-rep/')) {
            const date = narrative.split('/').pop();
            // Insert 'en' into narrative url to force English version of narrative
            // if user has a separate language preference
            if (narrative === 'narratives/ncov/sit-rep/' + date) {
              const narrativeParts = narrative.split('/');
              narrativeParts.splice(-1, 0, 'en');
              narrative = narrativeParts.join('/');
            }
            if (date === currentNarrativeDate) {
              translatedNarratives.push(narrative);
            }
          }
        });
        this.setState({
          currentNarrative: currentNarrative,
          availableNarratives: translatedNarratives
        });
      }).catch((error) => {
        console.log(error);
      });
    }

    handleLanguageChange(event) {
      const narrativeUrl = event.target.value;
      window.location.assign(window.location.origin + '/' + narrativeUrl + window.location.search);
    }

    render() {
      if (this.state.availableNarratives && this.state.currentNarrative) {
        return (
          <select value={this.state.currentNarrative} onChange={this.handleLanguageChange}>
            {this.state.availableNarratives.map((narrative) => {
              const narrativeLanguage = this.getNarrativeLanguage(narrative);
              return (
                <option value={narrative}>
                  {narrativeLanguage}
                </option>
              );
            })}
          </select>
        );
      }
      return null;
    }
}

export default LanguageSelector;
