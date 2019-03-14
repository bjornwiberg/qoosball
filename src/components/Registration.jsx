import React, { useState} from 'react';
import countryList from 'country-list';
import './Registration.css';

const Registration = () => {
  const [dominantHand, updateDominantHand] = useState('');
  const [name, updateName] = useState('');
  const [nationality, updateNationality] = useState('');
  const [race, updateRace] = useState('');
  const [slackId, updateSlackId] = useState('');
  const [trigram, updateTrigram] = useState('');

  const submitForm = () => {
    if (dominantHand && name && nationality && slackId && trigram) {
      console.log('save to database');
      return;
    }
    console.log('error');
  }

  const fields = {
    name: 'Name',
    trigram: 'Trigram',
    dominantHand: 'Dominant Hand',
    race: 'Race',
    slackId: 'Slack Id',
    nationality: 'Nationality',
  };

  const validationStatus = (field, value) => {
    return value === ''
      ? `${fields[field]} must be stated`
      : '';
  };

  return (
    <div className="registration-form">
      <div className="registration-form__input-group">
        <label for="foos-name">{fields.name} <span class="mandatory">*</span></label>
        <input id="foos-name" type="text" onChange={e => updateName(e.target.value)} />
      </div>
      <div className="registration-form__input-group-validation">
        {validationStatus('name', name)}
      </div>
      <div className="registration-form__input-group">
        <label for="foos-trigram">{fields.trigram} <span class="mandatory">*</span></label>
        <input id="foos-trigram" type="text" onChange={e => updateTrigram(e.target.value)} />
        <div className="registration-form__input-group-validation">
          {validationStatus('trigram', trigram)}
        </div>
      </div>
      <div className="registration-form__input-group">
        <label>{fields.dominantHand} <span class="mandatory">*</span></label>
        <input type="radio" value="left" name="dominant-hand" onChange={e => updateDominantHand(e.target.value)} />
        <input type="radio" value="right" name="dominant-hand" onChange={e => updateDominantHand(e.target.value)} />
        <div className="registration-form__input-group-validation">
          {validationStatus('dominantHand', dominantHand)}
        </div>
      </div>
      <div className="registration-form__input-group">
        <label for="foos-race">{fields.race}</label>
        <input id="foos-race" type="text" onChange={e => updateRace(e.target.value)} />
      </div>
      <div className="registration-form__input-group">
        <label for="foos-slack-id">{fields.slackId} <span class="mandatory">*</span></label>
        <input id="foos-slack-id" type="text" onChange={e => updateSlackId(e.target.value)} />
        <div className="registration-form__input-group-validation">
          {validationStatus('slackId', slackId)}
        </div>
      </div>
      <div className="registration-form__input-group">
        <label for="foos-nationality">{fields.nationality} <span class="mandatory">*</span></label>
        <select name="nationality" onChange={e => updateNationality(e.target.value)}>
          <option value="">Choose a country</option>
          {Object.entries(countryList.getCodeList()).map(([code, name ]) => (
            <option key={code} value={code}>{name}</option>
          ))}
        </select>
        <div className="registration-form__input-group-validation">
          {validationStatus('nationality', nationality)}
        </div>
      </div>
      <div className="registration-form__button-group">
        <button onClick={submitForm}>Save</button>
      </div>
    </div>
  );
}

export default Registration;
