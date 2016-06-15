package exportBeans.Self;

import exportBeans.Abstract.CustomerProfileSuperBean;
import entities.CustomerEntity;

/**
 * Created with IntelliJ IDEA.
 * User: OWNER
 * Date: 01/11/14
 * Time: 02:27
 * To change this template use File | Settings | File Templates.
 */
public class CustomerProfileSelfBean extends CustomerProfileSuperBean {

    public CustomerProfileSelfBean(CustomerEntity Customer){
        super(Customer);

        this.email = Customer.getEmail();

        this.dateLastLogin = Customer.getLastLogin().getTime();

        this.latitude = Customer.getPoslatitude();
        this.longitude = Customer.getPoslongitude();
    }
}
