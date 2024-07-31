import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContextProvider';

const CustomerForm = () => {
  // Accessing the context to get customers and update function
  const { customers, setCustomers } = useContext(UserContext);

  // Fetching the id parameter from the URL
  const { id } = useParams();
  const navigate = useNavigate();

  // Initial state for the form
  const initialFormState = {
    PAN: '',
    FullName: '',
    Email: '',
    Mobile: '',
    addresses: [{ Line1: '', Line2: '', Postcode: '', State: '', City: '' }],
  };

  // State variables for form data, errors, and loading indicators
  const [formState, setFormState] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [loadingPostcode, setLoadingPostcode] = useState(false);
  const [loadingPAN, setLoadingPAN] = useState(false);

  // Load customer data if an id is provided
  useEffect(() => {
    if (id) {
      const customer = customers.find((customer) => customer.id === id);
      if (customer) setFormState(customer);
    }
  }, [id, customers]);

  // Function to fetch state and city based on postcode
  const fetchStateAndCity = async (index) => {
    if (formState.addresses[index].Postcode.length === 6) {
      setLoadingPostcode(true);
      try {
        const response = await axios.post('https://lab.pixel6.co/api/get-postcode-details.php', {
          postcode: formState.addresses[index].Postcode,
        });
        if (response.data && response.data.status === 'Success') {
          const { city, state } = response.data;
          const updatedAddresses = [...formState.addresses];
          updatedAddresses[index].State = state.length > 0 ? state[0].name : '';
          updatedAddresses[index].City = city.length > 0 ? city[0].name : '';
          setFormState({ ...formState, addresses: updatedAddresses });
          setErrors({ ...errors, Postcode: '' });
        } else {
          setErrors({ ...errors, Postcode: 'Invalid Postcode' });
        }
      } catch (error) {
        console.error('Error fetching state and city:', error);
        setErrors({ ...errors, Postcode: 'Error fetching data' });
      } finally {
        setLoadingPostcode(false);
      }
    }
  };

  // Verify PAN and fetch full name if valid
  useEffect(() => {
    const verifyPAN = async () => {
      if (formState.PAN.match(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)) {
        setLoadingPAN(true);
        try {
          const response = await axios.post('https://lab.pixel6.co/api/verify-pan.php', { panNumber: formState.PAN });
          if (response.data && response.data.status === 'Success') {
            setFormState({ ...formState, FullName: response.data.fullName });
            setErrors({ ...errors, PAN: '' });
          } else {
            setErrors({ ...errors, PAN: 'Invalid PAN' });
          }
        } catch (error) {
          console.error('Error verifying PAN:', error);
          setErrors({ ...errors, PAN: 'Error verifying PAN' });
        } finally {
          setLoadingPAN(false);
        }
      }
    };

    verifyPAN();
  }, [formState.PAN]);

  // Handle input changes for the main form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  // Handle input changes for addresses
  const handleAddressChange = (index, e) => {
    const { name, value } = e.target;
    const updatedAddresses = [...formState.addresses];
    updatedAddresses[index][name] = value;
    setFormState({ ...formState, addresses: updatedAddresses });

    // Fetch state and city when postcode is changed
    if (name === 'Postcode') {
      fetchStateAndCity(index);
    }
  };

  // Add a new address field
  const addAddress = () => {
    if (formState.addresses.length < 10) {
      setFormState({
        ...formState,
        addresses: [...formState.addresses, { Line1: '', Line2: '', Postcode: '', State: '', City: '' }],
      });
    }
  };

  // Remove an address field
  const removeAddress = (index) => {
    const updatedAddresses = formState.addresses.filter((_, addrIndex) => addrIndex !== index);
    setFormState({ ...formState, addresses: updatedAddresses });
  };

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};

    if (!formState.PAN.match(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)) {
      newErrors.PAN = 'Invalid PAN format';
    }
    if (!formState.FullName) {
      newErrors.FullName = 'Full Name is required';
    }
    if (!formState.Email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/)) {
      newErrors.Email = 'Invalid Email format';
    }
    if (!formState.Mobile.match(/^[0-9]{10}$/)) {
      newErrors.Mobile = 'Invalid Mobile Number format';
    }
    formState.addresses.forEach((address, index) => {
      if (!address.Line1) {
        newErrors[`Line1-${index}`] = 'Address Line 1 is required';
      }
      if (!address.Postcode.match(/^[0-9]{6}$/)) {
        newErrors[`Postcode-${index}`] = 'Invalid Postcode format';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      if (id) {
        const updatedCustomers = customers.map((customer) =>
          customer.id === id ? { ...formState, id } : customer
        );
        setCustomers(updatedCustomers);
      } else {
        setCustomers([...customers, { ...formState, id: Date.now().toString() }]);
      }

      navigate('/');
    }
  };

  return (
    <div className="container mt-5">
      <h2>{id ? 'Edit Customer' : 'Add Customer'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>PAN</label>
          <div className="input-group">
            <input
              type="text"
              name="PAN"
              value={formState.PAN}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Enter PAN"
              required
              maxLength="10"
            />
            {loadingPAN && (
              <div className="input-group-append">
                <span className="input-group-text">
                  <i className="fa fa-spinner fa-spin"></i>
                </span>
              </div>
            )}
          </div>
          {errors.PAN && <small className="text-danger">{errors.PAN}</small>}
        </div>
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="FullName"
            value={formState.FullName}
            onChange={handleInputChange}
            className="form-control"
            placeholder="Enter Full Name"
            required
            maxLength="140"
          />
          {errors.FullName && <small className="text-danger">{errors.FullName}</small>}
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="Email"
            value={formState.Email}
            onChange={handleInputChange}
            className="form-control"
            placeholder="Enter Email"
            required
            maxLength="255"
          />
          {errors.Email && <small className="text-danger">{errors.Email}</small>}
        </div>
        <div className="form-group">
          <label>Mobile Number</label>
          <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text">+91</span>
            </div>
            <input
              type="text"
              name="Mobile"
              value={formState.Mobile}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Enter Mobile Number"
              required
              maxLength="10"
            />
          </div>
          {errors.Mobile && <small className="text-danger">{errors.Mobile}</small>}
        </div>
        {formState.addresses.map((address, index) => (
          <div key={index} className="mt-3">
            <h5>Address {index + 1}</h5>
            <div className="form-group">
              <label>Address Line 1</label>
              <input
                type="text"
                name="Line1"
                value={address.Line1}
                onChange={(e) => handleAddressChange(index, e)}
                className="form-control"
                placeholder="Enter Address Line 1"
                required
              />
              {errors[`Line1-${index}`] && <small className="text-danger">{errors[`Line1-${index}`]}</small>}
            </div>
            <div className="form-group">
              <label>Address Line 2</label>
              <input
                type="text"
                name="Line2"
                value={address.Line2}
                onChange={(e) => handleAddressChange(index, e)}
                className="form-control"
                placeholder="Enter Address Line 2"
              />
            </div>
            <div className="form-group">
              <label>Postcode</label>
              <div className="input-group">
                <input
                  type="text"
                  name="Postcode"
                  value={address.Postcode}
                  onChange={(e) => handleAddressChange(index, e)}
                  className="form-control"
                  placeholder="Enter Postcode"
                  required
                  maxLength="6"
                />
                {loadingPostcode && (
                  <div className="input-group-append">
                    <span className="input-group-text">
                      <i className="fa fa-spinner fa-spin"></i>
                    </span>
                  </div>
                )}
              </div>
              {errors[`Postcode-${index}`] && <small className="text-danger">{errors[`Postcode-${index}`]}</small>}
            </div>
            <div className="form-group">
              <label>State</label>
              <input
                type="text"
                name="State"
                value={address.State}
                onChange={(e) => handleAddressChange(index, e)}
                className="form-control"
                placeholder="Enter State"
                readOnly
              />
            </div>
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="City"
                value={address.City}
                onChange={(e) => handleAddressChange(index, e)}
                className="form-control"
                placeholder="Enter City"
                readOnly
              />
            </div>
            {formState.addresses.length > 1 && (
              <button type="button" className="btn btn-danger" onClick={() => removeAddress(index)}>
                Remove Address
              </button>
            )}
          </div>
        ))}
      
        <button type="submit" className="btn btn-success mt-3">
          {id ? 'Update' : 'Add'} Customer
        </button>
      </form>
    </div>
  );
};

export default CustomerForm;
