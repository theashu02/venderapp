import mongoose from 'mongoose';

const VendorSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Vendor name is required'] 
  },
  bankAccountNo: { 
    type: String, 
    required: [true, 'Bank account number is required'] 
  },
  bankName: { 
    type: String, 
    required: [true, 'Bank name is required'] 
  },
  addressLine1: { 
    type: String 
  },
  addressLine2: { 
    type: String, 
    required: [true, 'Address line 2 is required'] 
  },
  city: { 
    type: String 
  },
  country: { 
    type: String 
  },
  zipCode: { 
    type: String 
  },
  createdBy: {
    type: String,
    required: [true, 'Creator ID is required']
  }
}, {
  timestamps: true
});

export default mongoose.models.Vendor || mongoose.model('Vendor', VendorSchema);