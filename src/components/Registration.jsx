import React, { useState } from 'react';
import countryList from 'country-list';
import './Registration.css';
import { writeUserData } from '../firebase';

const Registration = () => {
  const [dominantHand, updateDominantHand] = useState('');
  const [name, updateName] = useState('');
  const [country, updateCountry] = useState('');
  const [race, updateRace] = useState('');
  const [slackId, updateSlackId] = useState('');
  const [trigram, updateTrigram] = useState('');
  const [showRegInfo, updateShowRegInfo] = useState('');
  const [showValidationInfo, updateShowValidationInfo] = useState(null);

  const submitForm = async () => {
    if (dominantHand && name && country && slackId && trigram) {
      console.log('save');
      try {
        await writeUserData(trigram, name, dominantHand, country, race, slackId); // this is async

        showThankYouMessage(true);
      } catch (error) {
        console.log({ error });
      }
    } else {
        showValidationMessage(true);
    }
  }

  const fields = {
    dominantHand: 'Dominant Hand',
    country: 'Country',
    name: 'Name',
    race: 'Race',
    slackId: 'Slack Id',
    trigram: 'Trigram',
  };

  const validationStatus = (field, value) => {
    return value === ''
      ? <li>{fields[field]} must be stated</li>
      : '';
  };

  const showValidationMessage = () => {
    updateShowValidationInfo(true);
  }

  const showThankYouMessage = () => {
    updateShowRegInfo(true);
    updateDominantHand('');
    updateName('');
    updateCountry('');
    updateRace('');
    updateTrigram('');
    updateDominantHand('');
    updateSlackId('');
  }

  return (
    <div className="registration-form">
      {showValidationInfo && (
        <div className="registration-form__information">
          <div className="registration-form__information-title">
            Error:
          </div>
          <ul>
            {validationStatus('name', name)}
            {validationStatus('trigram', trigram)}
            {validationStatus('dominantHand', dominantHand)}
            {validationStatus('slackId', slackId)}
            {validationStatus('country', country)}
          </ul>
          <button onClick={() => updateShowValidationInfo(false)}>Close</button>
        </div>
      )}
      {showRegInfo && (
        <div className="registration-form__information">
          <div className="registration-form__information-title">
            Thanks for registering
          </div>
          <button onClick={() => updateShowRegInfo(false)}>Close</button>
        </div>
      )}
      <div className="registration-form__header">
        Register to play
      </div>
      <div className="registration-form__input-group">
        <label htmlFor="foos-name">{fields.name} <span className="mandatory">*</span></label>
        <div className="registration-form__input-group-fields">
          <input id="foos-name" type="text" value={name} onChange={e => updateName(e.target.value)} />
        </div>
      </div>
      <div className="registration-form__input-group">
        <label htmlFor="foos-trigram">{fields.trigram} <span className="mandatory">*</span></label>
        <div className="registration-form__input-group-fields">
          <input id="foos-trigram" type="text" value={trigram} onChange={e => updateTrigram(e.target.value)} />
        </div>
      </div>
      <div className="registration-form__input-group">
        <label>{fields.dominantHand} <span className="mandatory">*</span></label>
        <div className="registration-form__input-group-fields">
          <label><input type="radio" value="left" name="dominant-hand" checked={dominantHand === 'left'} onChange={e => updateDominantHand(e.target.value)} />Left</label>
          <label><input type="radio" value="right" name="dominant-hand" checked={dominantHand === 'right'} onChange={e => updateDominantHand(e.target.value)} />Right</label>
        </div>
      </div>
      <div className="registration-form__input-group">
        <label htmlFor="foos-race">{fields.race}</label>
        <div className="registration-form__input-group-fields">
          <input id="foos-race" type="text" value={race} onChange={e => updateRace(e.target.value)} />
        </div>
      </div>
      <div className="registration-form__input-group">
        <label htmlFor="foos-slack-id">{fields.slackId} <span className="mandatory">*</span></label>
        <div className="registration-form__input-group-fields">
          <input id="foos-slack-id" type="text" value={slackId} onChange={e => updateSlackId(e.target.value)} />
        </div>
      </div>
      <div className="registration-form__input-group">
        <label>{fields.country} <span className="mandatory">*</span></label>
        <div className="registration-form__input-group-fields">
          <select name="country" value={country} onChange={e => updateCountry(e.target.value)}>
            <option value="">Choose a country</option>
            {Object.entries(countryList.getCodeList()).map(([code, name ]) => (
              <option key={code} value={code}>{name}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="registration-form__button-group">
        <button onClick={submitForm}>Save</button>
      </div>
    </div>
  );
}

export default Registration;
