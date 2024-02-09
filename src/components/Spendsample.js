import React, { useState } from 'react';
import { Card, Button, Input } from 'reactstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  user2_address: yup.string().required('User 2 address is required'),
});

const Spend = ({ instance }) => {
  const [spendPromise, setSpendPromise] = useState(null);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const result = await instance.methods.sendMoney(data.user2_address).send({ from: instance.user1 });
      setSpendPromise(result);
    } catch (error) {
      setSpendPromise(error.message);
    }
  };

  return (
    <Card className="bg-white p-6 rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-4">Send Money</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold text-gray-700">User 2 Address</label>
          <Input
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            type="text"
            name="user2_address"
            ref={register}
          />
          {errors.user2_address && <p className="text-red-500 text-xs mt-2">{errors.user2_address.message}</p>}
        </div>
        <Button className="bg-blue-500 text-white px-4 py-2 rounded-md" type="submit">
          Send Money
        </Button>
      </form>
      {spendPromise && (
        <div className="mt-4">
          <div className="font-bold text-lg mb-2">Spend result</div>
          <p className="text-gray-700">{spendPromise}</p>
        </div>
      )}
    </Card>
  );
};

export default Spend;