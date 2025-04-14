import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    balance: {
      type: Number,
      default: 0,
      min: 0
    },
    credit: {
      type: Number,
      default: 0,
      min: 0
    },
    accountNumber: {
      type: String,
      unique: true,
      default: function() {
        return Math.floor(1000000000 + Math.random() * 9000000000).toString();
      }
    },
    transactions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
      }
    ]
  },
  { 
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function(doc, ret) {
        ret.availableBalance = ret.balance + ret.credit;
        delete ret.__v;
        return ret;
      }
    }
  }
);

accountSchema.virtual('availableBalance').get(function() {
  return this.balance + this.credit;
});

export const Account = mongoose.model("Account", accountSchema);