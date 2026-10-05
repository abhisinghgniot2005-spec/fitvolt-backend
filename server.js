require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// =========================
// MIDDLEWARE
// =========================

app.use(cors());
app.use(express.json());

// =========================
// MEMBER MODEL
// =========================

const memberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    mobile: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      default: "",
      trim: true,
    },

    gender: {
      type: String,
      default: "",
      trim: true,
    },

    dob: {
      type: String,
      default: "",
    },

    plan: {
      type: String,
      default: "",
      trim: true,
    },

    joiningDate: {
      type: String,
      default: "",
    },

    amount: {
      type: Number,
      default: 0,
    },

    address: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Member = mongoose.model("Member", memberSchema);

// =========================
// PAYMENT MODEL
// =========================

const paymentSchema = new mongoose.Schema(
  {
    memberName: {
      type: String,
      required: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    paymentDate: {
      type: String,
      required: true,
    },

    paymentMethod: {
      type: String,
      required: true,
      trim: true,
    },

    membershipPlan: {
      type: String,
      default: "",
      trim: true,
    },

    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", paymentSchema);

// =========================
// ADD MEMBER
// =========================

app.post("/api/members", async (req, res) => {
  try {
    const {
      name,
      mobile,
      email,
      gender,
      dob,
      plan,
      joiningDate,
      amount,
      address,
    } = req.body;

    if (!name || !mobile) {
      return res.status(400).json({
        success: false,
        message:
          "Name and mobile are required",
      });
    }

    const member = new Member({
      name,
      mobile,
      email: email || "",
      gender: gender || "",
      dob: dob || "",
      plan: plan || "",
      joiningDate: joiningDate || "",
      amount: Number(amount) || 0,
      address: address || "",
    });

    const savedMember =
      await member.save();

    res.status(201).json({
      success: true,
      message:
        "Member added successfully",
      member: savedMember,
    });
  } catch (error) {
    console.error(
      "Add member error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to add member",
      error: error.message,
    });
  }
});

// =========================
// GET ALL MEMBERS
// =========================

app.get("/api/members", async (req, res) => {
  try {
    const members = await Member.find({})
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      members,
    });
  } catch (error) {
    console.error(
      "Get members error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch members",
      error: error.message,
    });
  }
});

// =========================
// GET SINGLE MEMBER
// =========================

app.get(
  "/api/members/:id",
  async (req, res) => {
    try {
      const { id } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(id)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid member ID",
        });
      }

      const member =
        await Member.findById(id).lean();

      if (!member) {
        return res.status(404).json({
          success: false,
          message: "Member not found",
        });
      }

      res.json({
        success: true,
        member,
      });
    } catch (error) {
      console.error(
        "Get single member error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch member",
        error: error.message,
      });
    }
  }
);

// =========================
// UPDATE MEMBER
// =========================

app.put(
  "/api/members/:id",
  async (req, res) => {
    try {
      const { id } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(id)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid member ID",
        });
      }

      const {
        name,
        mobile,
        email,
        gender,
        dob,
        plan,
        joiningDate,
        amount,
        address,
      } = req.body;

      if (!name || !mobile) {
        return res.status(400).json({
          success: false,
          message:
            "Name and mobile are required",
        });
      }

      const updatedMember =
        await Member.findByIdAndUpdate(
          id,
          {
            name: name.trim(),
            mobile: mobile.trim(),
            email: email || "",
            gender: gender || "",
            dob: dob || "",
            plan: plan || "",
            joiningDate:
              joiningDate || "",
            amount:
              Number(amount) || 0,
            address: address || "",
          },
          {
            new: true,
            runValidators: true,
          }
        ).lean();

      if (!updatedMember) {
        return res.status(404).json({
          success: false,
          message: "Member not found",
        });
      }

      res.json({
        success: true,
        message:
          "Member updated successfully",
        member: updatedMember,
      });
    } catch (error) {
      console.error(
        "Update member error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to update member",
        error: error.message,
      });
    }
  }
);

// =========================
// DELETE MEMBER
// =========================

app.delete(
  "/api/members/:id",
  async (req, res) => {
    try {
      const { id } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(id)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid member ID",
        });
      }

      const deletedMember =
        await Member.findByIdAndDelete(id);

      if (!deletedMember) {
        return res.status(404).json({
          success: false,
          message: "Member not found",
        });
      }

      res.json({
        success: true,
        message:
          "Member deleted successfully",
      });
    } catch (error) {
      console.error(
        "Delete member error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to delete member",
        error: error.message,
      });
    }
  }
);

// =========================
// ADD PAYMENT
// =========================

app.post("/api/payments", async (req, res) => {
  try {
    const {
      memberName,
      amount,
      paymentDate,
      paymentMethod,
      membershipPlan,
      notes,
    } = req.body;

    if (!memberName || !amount || !paymentDate || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message:
          "Member name, amount, payment date and payment method are required",
      });
    }

    const paymentAmount = Number(amount);

    if (!Number.isFinite(paymentAmount) || paymentAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Payment amount must be greater than 0",
      });
    }

    const payment = new Payment({
      memberName: memberName.trim(),
      amount: paymentAmount,
      paymentDate,
      paymentMethod,
      membershipPlan: membershipPlan || "",
      notes: notes || "",
    });

    const savedPayment = await payment.save();

    res.status(201).json({
      success: true,
      message: "Payment recorded successfully",
      payment: savedPayment,
    });
  } catch (error) {
    console.error("Add payment error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to record payment",
      error: error.message,
    });
  }
});


// =========================
// GET ALL PAYMENTS
// =========================

app.get("/api/payments", async (req, res) => {
  try {
    const payments = await Payment.find({})
      .sort({ paymentDate: -1, createdAt: -1 })
      .lean();

    res.json({
      success: true,
      payments,
    });
  } catch (error) {
    console.error("Get payments error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch payments",
      error: error.message,
    });
  }
});


// =========================
// GET TOTAL COLLECTION
// =========================

app.get("/api/payments/total", async (req, res) => {
  try {
    const result = await Payment.aggregate([
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const total = result.length > 0 ? result[0].total : 0;

    res.json({
      success: true,
      total,
    });
  } catch (error) {
    console.error("Get total collection error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to calculate total collection",
      error: error.message,
    });
  }
});
// =========================
// ADD PAYMENT
// =========================

app.post("/api/payments", async (req, res) => {
  try {
    const {
      memberName,
      amount,
      paymentDate,
      paymentMethod,
      membershipPlan,
      notes,
    } = req.body;

    if (!memberName || !amount || !paymentDate || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message:
          "Member name, amount, payment date and payment method are required",
      });
    }

    const paymentAmount = Number(amount);

    if (!Number.isFinite(paymentAmount) || paymentAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Payment amount must be greater than 0",
      });
    }

    const payment = new Payment({
      memberName: memberName.trim(),
      amount: paymentAmount,
      paymentDate,
      paymentMethod,
      membershipPlan: membershipPlan || "",
      notes: notes || "",
    });

    const savedPayment = await payment.save();

    res.status(201).json({
      success: true,
      message: "Payment recorded successfully",
      payment: savedPayment,
    });
  } catch (error) {
    console.error("Add payment error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to record payment",
      error: error.message,
    });
  }
});


// =========================
// GET ALL PAYMENTS
// =========================

app.get("/api/payments", async (req, res) => {
  try {
    const payments = await Payment.find({})
      .sort({ paymentDate: -1, createdAt: -1 })
      .lean();

    res.json({
      success: true,
      payments,
    });
  } catch (error) {
    console.error("Get payments error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch payments",
      error: error.message,
    });
  }
});


// =========================
// GET TOTAL COLLECTION
// =========================

app.get("/api/payments/total", async (req, res) => {
  try {
    const result = await Payment.aggregate([
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const total = result.length > 0 ? result[0].total : 0;

    res.json({
      success: true,
      total,
    });
  } catch (error) {
    console.error("Get total collection error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to calculate total collection",
      error: error.message,
    });
  }
});

// ==================================================
// PAYMENT SYSTEM
// ==================================================

// =========================
// GENERATE RECEIPT NUMBER
// =========================

async function generateReceiptNumber() {
  const count = await Payment.countDocuments();

  const nextNumber = count + 1;

  return `FV-${String(nextNumber).padStart(
    4,
    "0"
  )}`;
}

// =========================
// ADD PAYMENT
// =========================

app.post(
  "/api/payments",
  async (req, res) => {
    try {
      const {
        memberId,
        amount,
        paymentDate,
        paymentMethod,
        status,
      } = req.body;

      // Check member ID
      if (
        !memberId ||
        !mongoose.Types.ObjectId.isValid(
          memberId
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Valid member ID is required",
        });
      }

      // Manual amount validation
      if (
        amount === undefined ||
        amount === null ||
        amount === "" ||
        Number(amount) <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Please enter a valid payment amount",
        });
      }

      // Find member
      const member =
        await Member.findById(memberId);

      if (!member) {
        return res.status(404).json({
          success: false,
          message: "Member not found",
        });
      }

      const receiptNumber =
        await generateReceiptNumber();

      const payment =
        new Payment({
          memberId: member._id,

          memberName: member.name,

          plan: member.plan || "",

          // Admin entered amount
          amount: Number(amount),

          paymentDate:
            paymentDate ||
            new Date()
              .toISOString()
              .slice(0, 10),

          paymentMethod:
            paymentMethod || "Cash",

          status: status || "Paid",

          receiptNumber,
        });

      const savedPayment =
        await payment.save();

      res.status(201).json({
        success: true,
        message:
          "Payment added successfully",
        payment: savedPayment,
      });
    } catch (error) {
      console.error(
        "❌ Add payment error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to add payment",
        error: error.message,
      });
    }
  }
);

// =========================
// GET ALL PAYMENTS
// =========================

app.get(
  "/api/payments",
  async (req, res) => {
    try {
      const payments =
        await Payment.find({})
          .sort({ createdAt: -1 })
          .lean();

      res.json({
        success: true,
        payments,
      });
    } catch (error) {
      console.error(
        "❌ Get payments error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch payments",
        error: error.message,
      });
    }
  }
);

// =========================
// GET PAYMENTS OF ONE MEMBER
// =========================

app.get(
  "/api/payments/member/:memberId",
  async (req, res) => {
    try {
      const { memberId } =
        req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          memberId
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid member ID",
        });
      }

      const payments =
        await Payment.find({
          memberId,
        })
          .sort({
            paymentDate: -1,
            createdAt: -1,
          })
          .lean();

      res.json({
        success: true,
        payments,
      });
    } catch (error) {
      console.error(
        "❌ Get member payments error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch member payments",
        error: error.message,
      });
    }
  }
);

// =========================
// DELETE PAYMENT
// =========================

app.delete(
  "/api/payments/:id",
  async (req, res) => {
    try {
      const { id } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(id)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid payment ID",
        });
      }

      const deletedPayment =
        await Payment.findByIdAndDelete(id);

      if (!deletedPayment) {
        return res.status(404).json({
          success: false,
          message:
            "Payment not found",
        });
      }

      res.json({
        success: true,
        message:
          "Payment deleted successfully",
      });
    } catch (error) {
      console.error(
        "❌ Delete payment error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to delete payment",
        error: error.message,
      });
    }
  }
);

// =========================
// PAYMENT COLLECTION
// =========================

// Total collection
app.get(
  "/api/payments/stats/collection",
  async (req, res) => {
    try {
      const result =
        await Payment.aggregate([
          {
            $match: {
              status: "Paid",
            },
          },
          {
            $group: {
              _id: null,
              total: {
                $sum: "$amount",
              },
            },
          },
        ]);

      const totalCollection =
        result.length > 0
          ? result[0].total
          : 0;

      res.json({
        success: true,
        totalCollection,
      });
    } catch (error) {
      console.error(
        "❌ Collection stats error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to calculate collection",
        error: error.message,
      });
    }
  }
);

// =========================
// 404
// =========================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message:
      "API route not found",
  });
});

// =========================
// START SERVER
// =========================

async function startServer() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error(
        "MONGO_URI is missing in .env"
      );
    }

    await mongoose.connect(
      process.env.MONGO_URI,
      {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
      }
    );

    console.log(
      "✅ MongoDB connected successfully"
    );

    console.log(
      "📦 Database:",
      mongoose.connection.name
    );

    console.log(
      "🌐 Host:",
      mongoose.connection.host
    );

    app.listen(PORT, () => {
      console.log(
        `🚀 Server running on http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "❌ MongoDB connection failed:"
    );

    console.error(error.message);

    process.exit(1);
  }
}

startServer();