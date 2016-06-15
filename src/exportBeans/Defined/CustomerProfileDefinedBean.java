package exportBeans.Defined;

import entities.*;

/**
 * Created with IntelliJ IDEA.
 * User: OWNER
 * Date: 01/11/14
 * Time: 02:27
 * To change this template use File | Settings | File Templates.
 */
public class CustomerProfileDefinedBean {

    private int id;
    private String email;

    private String firstName;
    private String lastName;

    private double latitude;
    private double longitude;

    public CustomerProfileDefinedBean(CustomerEntity Customer){
        this.id = Customer.getId();
        this.email = Customer.getEmail();

        this.firstName = Customer.getFirstname();
        this.lastName = Customer.getLastname();

        this.latitude = Customer.getPoslatitude();
        this.longitude = Customer.getPoslongitude();
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }
}
