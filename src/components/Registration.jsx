import React, { useState } from 'react';
import countryList from 'country-list';
import './Registration.css';
import { writeUserData } from '../firebase';

const Registration = () => {
  const [dominantHand, updateDominantHand] = useState(null);
  const [name, updateName] = useState(null);
  const [country, updateCountry] = useState(null);
  const [race, updateRace] = useState(null);
  const [slackId, updateSlackId] = useState(null);
  const [trigram, updateTrigram] = useState(null);

  const submitForm = () => {
    if (dominantHand && name && country && slackId && trigram) {
      return writeUserData(trigram, name, dominantHand, country, race, slackId); // this is async
    }
    console.log('error');
  }

  const fields = {
    country: 'Country',
    dominantHand: 'Dominant Hand',
    name: 'Name',
    race: 'Race',
    slackId: 'Slack Id',
    trigram: 'Trigram',
  };

  const validationStatus = (field, value) => {
    return value === ''
      ? `${fields[field]} must be stated`
      : '';
  };

  return (
    <div className="registration-form">
      <div className="registration-form__header">
        Register to play
      </div>
      <div className="registration-form__input-group">
        <label htmlFor="foos-name">{fields.name} <span className="mandatory">*</span></label>
        <div className="registration-form__input-group-fields">
          <input id="foos-name" type="text" onChange={e => updateName(e.target.value)} />
        </div>
      </div>
      <div className="registration-form__input-group-validation">
        {validationStatus('name', name)}
      </div>
      <div className="registration-form__input-group">
        <label htmlFor="foos-trigram">{fields.trigram} <span className="mandatory">*</span></label>
        <div className="registration-form__input-group-fields">
          <input id="foos-trigram" type="text" onChange={e => updateTrigram(e.target.value)} />
        </div>
      </div>
      <div className="registration-form__input-group-validation">
        {validationStatus('trigram', trigram)}
      </div>
      <div className="registration-form__input-group">
        <label>{fields.dominantHand} <span className="mandatory">*</span></label>
        <div className="registration-form__input-group-fields">
          <label><input type="radio" value="left" name="dominant-hand" onChange={e => updateDominantHand(e.target.value)} />Left</label>
          <label><input type="radio" value="right" name="dominant-hand" onChange={e => updateDominantHand(e.target.value)} />Right</label>
        </div>
      </div>
      <div className="registration-form__input-group-validation">
        {validationStatus('dominantHand', dominantHand)}
      </div>
      <div className="registration-form__input-group">
        <label htmlFor="foos-race">{fields.race}</label>
        <div className="registration-form__input-group-fields">
          <input id="foos-race" type="text" onChange={e => updateRace(e.target.value)} />
        </div>
      </div>
      <div className="registration-form__input-group-validation" />
      <div className="registration-form__input-group">
        <label htmlFor="foos-slack-id">{fields.slackId} <span className="mandatory">*</span></label>
        <div className="registration-form__input-group-fields">
          <input id="foos-slack-id" type="text" onChange={e => updateSlackId(e.target.value)} />
        </div>
      </div>
      <div className="registration-form__input-group-validation">
        {validationStatus('slackId', slackId)}
      </div>
      <div className="registration-form__input-group">
        <label>{fields.country} <span className="mandatory">*</span></label>
        <div className="registration-form__input-group-fields">
          <select name="country" onChange={e => updateCountry(e.target.value)}>
            <option value="">Choose a country</option>
            {Object.entries(countryList.getCodeList()).map(([code, name ]) => (
              <option key={code} value={code}>{name}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="registration-form__input-group-validation">
        {validationStatus('country', country)}
      </div>
      <div className="registration-form__button-group">
        <button onClick={submitForm}>Save</button>
      </div>
    </div>
  );
}

export default Registration;
