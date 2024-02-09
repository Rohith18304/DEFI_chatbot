import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input, Button, Form, FormGroup, Label, Alert } from 'reactstrap';

const SpendForm = ({ instance, onSpend }) => {
  const [spendPromise, setSpendPromise] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const { register, handleSubmit, errors } = useForm();

  const onValid = async (data) => {
    setErrorMessage('');

    try {
      const result = await instance.spend(data.spendAmount, data.spendTo);
      onSpend(result.hash);
      setSpendPromise(result.hash);
    } catch (error) {
      setErrorMessage(error.message);
      console.error(error.message);
    }
  };

  return (
    <Form onSubmit={handleSubmit(onValid)}>
      <FormGroup>
        <Label for="spendTo">Recipient address</Label>
        <Input
          id="spendTo"
          name="spendTo"
          placeholder="ak_..."
          innerRef={register({
            required: 'Required',
            pattern: {
              value: /^ak_[a-zA-Z0-9]+$/,
              message: 'Invalid recipient address',
            },
          })}
        />
        {errors.spendTo && <p className="text-danger">{errors.spendTo.message}</p>}
      </FormGroup>
      <FormGroup>
        <Label for="spendAmount">Coins amount</Label>
        <Input
          id="spendAmount"
          name="spendAmount"
          placeholder="0"
          innerRef={register({
            required: 'Required',
            min: {
              value: 1,
              message: 'Coins amount must be greater than 0',
            },
          })}
        />
        {errors.spendAmount && (
          <p className="text-danger">{errors.spendAmount.message}</p>
        )}
      </FormGroup>
      <FormGroup>
        <Label for="spendPayload">Payload</Label>
        <Input
          id="spendPayload"
          name="spendPayload"
          placeholder="..."
          innerRef={register}
        />
      </FormGroup>
      {errorMessage && (
        <Alert color="danger">{errorMessage}</Alert>
      )}
      {spendPromise && (
        <p>Spend result: {spendPromise}</p>
      )}
      <Button type="submit" color="primary">
        Spend
      </Button>
    </Form>
  );
};

const Spend = ({ instance }) => {
  const [spendPromise, setSpendPromise] = useState(null);

  const onSpend = (hash) => {
    setSpendPromise(hash);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4">Spend Coins</h2>
      <SpendForm instance={instance} onSpend={onSpend} />
      {spendPromise && (
        <div className="mt-4">
          <div className="font-bold text-lg mb-2">Spend result</div>
          <p className="text-gray-700">{spendPromise}</p>
        </div>
      )}
    </div>
  );
};

export default Spend;