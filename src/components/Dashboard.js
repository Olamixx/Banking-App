import React, { useEffect, useCallback, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './Header'; 

// Styling
const DashboardContainer = styled.div`
  display: flex;
  width: 100%; 
  background-color: #f7f7f7;
  padding: 0;
  margin: 0;
  height: 100vh;
`;

const Sidebar = styled.nav`
  width: 250px;
  height: 100%;
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  position: fixed;
  left: 0;
  top: 0;
`;

const NavItems = styled.div`
  display: flex;
  flex-direction: column;
`;

const NavItem = styled.div`
  padding: 10px 20px;
  margin: 5px 0;
  font-size: 16px;
  cursor: pointer;
  color: ${(props) => (props.active ? '#4caf50' : '#fff')};
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const MainContent = styled.div`
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
  margin-left: 250px;
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const WelcomeMessage = styled.h2`
  font-family: 'Orbitron', sans-serif;
  color: ${(props) => props.theme.colors.primary};
  font-size: 24px;
`;

const AccountDetails = styled.div`
  font-size: 15px;
  font-family: 'Orbitron', sans-serif;
  text-align: right;
  color: #666;
`;

const AccountInfo = styled.p`
  margin: 5px 0;
`;

const BalanceSection = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
`;

const BalanceLabel = styled.h3`
  font-family: 'Orbitron', sans-serif;
  font-size: 20px;
  color: ${(props) => props.theme.colors.primary};
`;

const TotalBalance = styled.span`
  font-size: 20px;
  font-family: 'Orbitron', sans-serif;
  color: #333;
`;

const Widget = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const PaymentWidget = styled(Widget)`
  display: flex;
  flex-direction: column;
  align-items: left;
`;

const StatisticWidget = styled(Widget)`
  p {
    font-size: 18px;
    color: #4caf50;
    margin: 0;
  }
`;

const RecentTransactions = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  h3 {
    margin-bottom: 20px;
  }

  ul {
    list-style-type: none;
    padding: 0;

    li {
      display: flex;
      justify-content: space-between;
      margin: 8px 0;
      border-bottom: 1px solid #ddd;
      padding-bottom: 8px;
    }
  }

  button {
    background: ${(props) => props.theme.colors.primary};
    color: white;
    padding: 10px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    margin-top: 20px;
    width: 100%;

    &:hover {
      opacity: 0.9;
    }
  }
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 30px;
`;


const Button = styled.button`
  background-color: ${(props) => props.theme.colors.primary};
  color: #fff;
  padding: 15px 30px;
  border: none;
  border-radius: 8px;
  font-size: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
  flex: 1;
  margin: 0 10px;

  &:hover {
    background-color: rgba(0, 123, 255, 0.8);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  text-align: center;
`;

const Dashboard = () => {
  const [balance, setBalance] = useState(0);
  const [accounts, setAccounts] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAccountNumber, setSelectedAccountNumber] = useState(null);
  const [fundAmount, setFundAmount] = useState('');
  const [recentTransactions, setRecentTransactions] = useState([]);
  const navigate = useNavigate();

  const fetchDashboardData = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');
      console.log(localStorage.getItem('authToken')); 

      if (!token) {
        navigate('/');
        return;
      }
      const response = await axios.get('http://localhost:5000/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBalance(response.data.totalBalance || 0);
      setAccounts(response.data.accounts || []);
      setFirstName(response.data.firstName || '');
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      if (error.response && error.response.status === 401) {
        navigate('/');
      }
    }
  }, [navigate]);

  const fetchRecentTransactions = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('http://localhost:5000/recent-transactions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecentTransactions(response.data); 
    } catch (error) {
      console.error('Error fetching recent transactions:', error);
    }
  };


  useEffect(() => {
    fetchDashboardData();
    fetchRecentTransactions();
  }, [fetchDashboardData]);

  const openFundAccountModal = (accountNumber) => {
    setSelectedAccountNumber(accountNumber);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  const handleFundAccount = async () => {

    if (!fundAmount || isNaN(fundAmount) || fundAmount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      console.log({ accountNumber: selectedAccountNumber, amount: parseFloat(fundAmount) },);
      await axios.post(
        'http://localhost:5000/fund-account',
        { accountNumber: selectedAccountNumber, amount: parseFloat(fundAmount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Account funded successfully!');
      fetchDashboardData();
      closeModal();
    } catch (error) {
      console.error('Error funding account:', error);
      alert('Failed to fund account.');
    }
  };

  

  return (
    <DashboardContainer>
      <Sidebar>
        <Header showLogo showName={false} /> 
        <NavItems>
          <NavItem active>Dashboard</NavItem>
          <NavItem>Wallet</NavItem>
          <NavItem>Messages</NavItem>
          <NavItem>Reports</NavItem>
          <NavItem>Settings</NavItem>
        </NavItems>
        <NavItem onClick={() => navigate('/logout')}>Logout</NavItem>
      </Sidebar>

      {/* Main Content */}
      <MainContent>
        <DashboardHeader>
          <WelcomeMessage>Welcome, {firstName}!</WelcomeMessage>
          <AccountDetails>
            {accounts.length > 0 ? (
              <>
                <AccountInfo>Account Type: {accounts[0].accountType}</AccountInfo>
                <AccountInfo>Account Number: {accounts[0].accountNumber}</AccountInfo>
              </>
            ) : (
              <p>Loading account details...</p>
            )}
          </AccountDetails>
        </DashboardHeader>

        <BalanceSection>
  <div>
    <BalanceLabel>Total Balance:</BalanceLabel>
    <TotalBalance>
    ${parseFloat(balance).toLocaleString()}
    </TotalBalance>
  </div>
</BalanceSection>


{/* Widgets */}
<div>
    <PaymentWidget>
      <h3>Payments</h3>
      <ActionButtons>
      <Button onClick={() => openFundAccountModal(accounts.length > 0 ? accounts[0].accountNumber : null)}>Fund Account</Button>
      <Button onClick={() => navigate('/payment')}>Trasnfer</Button>
      </ActionButtons>
    </PaymentWidget>

    <StatisticWidget>
      <h3>Statistics</h3>
      <p>.....</p>
    </StatisticWidget>

    <RecentTransactions>
      <h3>Recent Transactions</h3>
      <ul>
        {recentTransactions.map((transaction) => (
          <li key={transaction.id}>
            <span>{transaction.description}</span>
            <span>${parseFloat(transaction.amount).toLocaleString()}</span>
          </li>
        ))}
      </ul>
      <button onClick={() => navigate('/transactions')}>View All Transactions</button>
    </RecentTransactions>
  </div>

        {isModalOpen && (
          <ModalOverlay>
            <ModalContent>
              <h2>Fund Account</h2>
              <input
                type="number"
                value={fundAmount}
                onChange={(e) => setFundAmount(e.target.value)}
                placeholder="Enter amount"
              />
              <div>
                <Button onClick={handleFundAccount}>Submit</Button>
                <Button onClick={closeModal} style={{ backgroundColor: '#ff4d4d' }}>
                  Cancel
                </Button>
              </div>
            </ModalContent>
          </ModalOverlay>
        )}
      </MainContent>
    </DashboardContainer>
  );
};

export default Dashboard;
