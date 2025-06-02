-- Create Database
CREATE DATABASE property_management_system;
USE property_management_system;

-- 1. Users Table
CREATE TABLE Users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    role ENUM('Admin', 'StockManager', 'StoreMan', 'Staff', 'DepartmentHead', 'ControlRoom') NOT NULL,
    department_id INT,
    phone VARCHAR(15),
    address VARCHAR(255),
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
-- 1.5 Accounts Table
CREATE TABLE Accounts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL UNIQUE,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- 2. Departments Table
CREATE TABLE Departments (
    department_id INT PRIMARY KEY AUTO_INCREMENT,
    department_name VARCHAR(100) NOT NULL,
    department_head_id INT UNIQUE,
    FOREIGN KEY (department_head_id) REFERENCES Users(id) ON DELETE SET NULL
);

ALTER TABLE Users
ADD FOREIGN KEY (department_id) REFERENCES Departments(department_id) ON DELETE SET NULL;

-- 3. Assets Table
CREATE TABLE Assets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    model_name VARCHAR(50),
    code VARCHAR(50) UNIQUE NOT NULL,
    type ENUM('Fixed', 'Consumable') NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    cost DECIMAL(10, 2),
    status ENUM('Active', 'Replaced', 'Donated', 'Removed') DEFAULT 'Active',
    disposition ENUM('Primary', 'Secondary', 'None') DEFAULT 'None',
    department_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES Departments(department_id) ON DELETE SET NULL
);

-- 4. Asset Disposals Table
CREATE TABLE Asset_Disposals (
    id INT PRIMARY KEY AUTO_INCREMENT,
    asset_id INT NOT NULL,
    replacement_type ENUM('Replaced', 'Donated', 'Removed') NOT NULL,
    replacement_reason VARCHAR(255),
    new_asset_id INT,
    institution_name VARCHAR(100),
    disposal_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (asset_id) REFERENCES Assets(id) ON DELETE CASCADE,
    FOREIGN KEY (new_asset_id) REFERENCES Assets(id) ON DELETE SET NULL
);

-- 5. Stock Table
CREATE TABLE Stock (
    id INT PRIMARY KEY AUTO_INCREMENT,
    asset_id INT NOT NULL,
    operation ENUM('Stock-In', 'Stock-Out') NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0), -- Ensure positive quantity
    stock_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('Pending', 'Approved', 'Denied') DEFAULT 'Pending',
    user_id INT NOT NULL,
    approval_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (asset_id) REFERENCES Assets(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- 6. Requests Table
CREATE TABLE Requests (
  id INT PRIMARY KEY AUTO_INCREMENT,
  employee_id INT NOT NULL,
  asset_id INT NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  -- Status flow management
  status ENUM(
    'Pending',            -- Default: waiting for Department Head
    'DeptApproved',       -- Approved by Department Head
    'DeptDenied',         -- Denied by Department Head
    'ManagerApproved',    -- Approved by Manager
    'ManagerDenied',      -- Denied by Manager
    'Allocated'           -- Confirmed and fulfilled by Storekeeper
  ) DEFAULT 'Pending',
  -- Purpose + Dates
  purpose TEXT,
  request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  -- Track approvals
  dept_head_id INT,     -- Who approved/denied at department level
  dept_action_date TIMESTAMP NULL,

  manager_id INT,       -- Who approved/denied at manager level
  manager_action_date TIMESTAMP NULL,

  -- Final allocator
  storekeeper_id INT,
  allocation_date TIMESTAMP NULL,

  -- Foreign keys
  FOREIGN KEY (employee_id) REFERENCES Users(id) ON DELETE CASCADE,
  FOREIGN KEY (asset_id) REFERENCES Assets(id) ON DELETE CASCADE,
  FOREIGN KEY (dept_head_id) REFERENCES Users(id) ON DELETE SET NULL,
  FOREIGN KEY (manager_id) REFERENCES Users(id) ON DELETE SET NULL,
  FOREIGN KEY (storekeeper_id) REFERENCES Users(id) ON DELETE SET NULL
);


-- 7. Transfers Table
CREATE TABLE Transfers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    asset_id INT NOT NULL,
    from_user_id INT NOT NULL,
    to_user_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0), -- Ensure positive quantity
    transfer_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reason VARCHAR(255),
    approved_by INT,
    FOREIGN KEY (asset_id) REFERENCES Assets(id) ON DELETE CASCADE,
    FOREIGN KEY (from_user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (to_user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES Users(id) ON DELETE SET NULL
);

-- 8. Returns Table
CREATE TABLE Returns (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT NOT NULL,
    asset_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0), -- Ensure positive quantity
    return_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description VARCHAR(255),
    received_by INT,
    FOREIGN KEY (employee_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (asset_id) REFERENCES Assets(id) ON DELETE CASCADE,
    FOREIGN KEY (received_by) REFERENCES Users(id) ON DELETE SET NULL
);

-- 9. Unfulfilled Requests Table
CREATE TABLE Unfulfilled_Requests (
  id INT PRIMARY KEY AUTO_INCREMENT,
  employee_id INT NOT NULL,
  asset_name VARCHAR(100) NOT NULL,
  asset_type ENUM('Fixed', 'Consumable') NOT NULL,
  quantity INT NOT NULL,
  purpose TEXT,
  request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('Pending', 'Reviewed') DEFAULT 'Pending',
  FOREIGN KEY (employee_id) REFERENCES Users(id)
);

-- Indexes for performance optimization
CREATE INDEX idx_email ON Users(email);
CREATE INDEX idx_asset_code ON Assets(code);
CREATE INDEX idx_asset_id ON Stock(asset_id);
CREATE INDEX idx_request_status ON Requests(status);


-- Extend status ENUM for returns
ALTER TABLE Requests MODIFY COLUMN status ENUM(
  'Pending',
  'DeptApproved',
  'DeptDenied',
  'ManagerApproved',
  'ManagerDenied',
  'Allocated',
  'Accepted',         -- Final confirmed
  'RejectedByUser',   -- Optional: user rejected item
  'ReturnRequested',  -- ✅ New: user initiates return
  'Returned'          -- ✅ New: storeman confirmed return
) DEFAULT 'Pending';

ALTER TABLE Requests
ADD COLUMN user_confirmation_date TIMESTAMP NULL;
CREATE TABLE Announcements (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255),
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
