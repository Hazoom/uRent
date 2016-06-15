package dao;

import entities.CustomerEntity;
import exportBeans.Abstract.CustomerProfileSuperBean;

import javax.ejb.Local;

import java.sql.Timestamp;

/**
 * Created with IntelliJ IDEA.
 * User: OWNER
 * Date: 30/11/14
 * Time: 13:22
 * To change this template use File | Settings | File Templates.
 */
@Local
public interface CustomerDAO {
    public String validateLogin(String Email, String Password);
    public boolean validateLogin(int CustomerId, String Password);
    public int validateLogin(String LoginString);
    public int addCustomer(String Email, String FirstName, String LastName,
                           double Latitude, double Longitude,
                           String Password);
    public boolean updateCustomer(int CustomerId, String Email, String FirstName, String LastName, double Lat, double Lon);
    public boolean deleteCustomer(int CustomerId);
    public String changePassword(int CustomerId, String Password);
    public String changePassword(String Email, String Password);
    public String createInitPasswordString(String Email);
    public String verifyInitPasswordString(String passwordStr);
    public CustomerProfileSuperBean populateCustomerDetails(int WantedCustomerId, int CustomerId);
    public CustomerEntity getCustomerById(int CustomerId);
    public CustomerEntity getCustomerByEmail(String Email);
    public String validateLoginWithDetails(String LoginString);
    public Timestamp getCustomerLastLogin(int CustomerId);
    public String getUserDetails(String LoginString);
    public int addContactUsInfo(String email, String firstName, String lastName, String comment);
}