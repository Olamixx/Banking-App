import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 600px;
  margin: auto;
  padding: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 10px 20px;
  margin-right: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }

  &.active {
    background-color: #0056b3;
  }
`;

const ErrorMessage = styled.p`
  color: red;
`;

const SuccessMessage = styled.p`
  color: green;
`;

const Payment = () => {
  const [toAccountNumber, setToAccountNumber] = useState('');
  const [bank, setBank] = useState('');
  const [amount, setAmount] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [transferType, setTransferType] = useState('tresdil'); // Default
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto-validate recipient on input change
  useEffect(() => {
    const validateRecipient = async () => {
      if (toAccountNumber && bank) {
        try {
          setError('');
          setRecipientName('');
          
          //validate the account
          const response = await axios.get('http://localhost:5000/validate-account', {
            params: {
              accountNumber: toAccountNumber,
              bank,
            },
          });
          
          // Set recipient name on successful validation
          const { firstname, lastname } = response.data;
          setRecipientName(`${firstname} ${lastname}`);
        } catch (err) {
         
          const errorMessage = err.response?.data?.message || 'Recipient validation failed.';
          setError(errorMessage);
          setRecipientName('');
        }
      }
    };
  
    const timeoutId = setTimeout(() => validateRecipient(), 500);
    return () => clearTimeout(timeoutId);
  }, [toAccountNumber, bank]);

  const handleTransfer = async () => {
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('authToken'); 
      console.log(localStorage.getItem('authToken')); // Check if the token exists in localStorage

      setLoading(true);
      const { data } = await axios.post(
        'http://localhost:5000/transfer',
        {
          toAccountNumber,
          amount,
          bank,
          transferType, 
        },
        {
          headers: { Authorization: `Bearer ${token}` }, 
        }
      );
      setSuccess(data.message);
      setToAccountNumber('');
      setBank('');
      setAmount('');
      setRecipientName('');
    } catch (err) {
      setError(err.response?.data?.message || 'Transfer failed.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Container>
      <h2>Transfer Funds</h2>

      <div>
        <Button
          className={transferType === 'tresdil' ? 'active' : ''}
          onClick={() => setTransferType('tresdil')}
        >
          To Tresdil
        </Button>
        <Button
          className={transferType === 'bank' ? 'active' : ''}
          onClick={() => setTransferType('bank')}
        >
          To Bank
        </Button>
      </div>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}

      <FormGroup>
        <Label>To Account Number:</Label>
        <Input
          type="text"
          value={toAccountNumber}
          onChange={(e) => setToAccountNumber(e.target.value)}
          placeholder="Enter recipient account number"
        />
      </FormGroup>

      <FormGroup>
        <Label>Bank:</Label>
        <Select value={bank} onChange={(e) => setBank(e.target.value)}>
          <option value="">Select Bank</option>
          <option value="Tresdil Bank">Tresdil Bank</option>
          <option value="GTB">GT BANK</option>
          <option value="First Bank">First Bank</option>
          <option value="Access">Access Bank </option>
        </Select>
      </FormGroup>

      {recipientName && <p>Recipient: {recipientName}</p>}

      <FormGroup>
        <Label>Amount:</Label>
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount to transfer"
        />
      </FormGroup>

      <Button
        onClick={handleTransfer}
        disabled={loading || !toAccountNumber || !amount || !bank || !recipientName}
      >
        {loading ? 'Processing...' : 'Transfer'}
      </Button>
    </Container>
  );
};

export default Payment;
