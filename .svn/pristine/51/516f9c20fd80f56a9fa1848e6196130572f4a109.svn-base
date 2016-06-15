package bl;

import dao.CategoryDAO;
import exportBeans.CategoryBean;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: OWNER
 * Date: 30/11/14
 * Time: 13:36
 * To change this template use File | Settings | File Templates.
 */
@Path("/CategoryService")
@Stateless
public class CategoryBL {

    @EJB
    private CategoryDAO categoryManager;

    public CategoryBL(){
    }

    /**
     *
     * @return
     */
    @Path("/getAll")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public List<CategoryBean> getAllCategoriesOrderedByParentAndName() {
        List<CategoryBean> lstCategories = categoryManager.getAllCategories();

        return lstCategories;
    }

    /**
     *
     * @return
     */
    @Path("/getAllSonCategories")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public List<CategoryBean> getAllSonCategories(String JsonObject){
        JSONObject json = null;
        List<CategoryBean> lstCategories = null;

        try {
            json = (JSONObject) new JSONParser().parse(JsonObject);

            int categoryId = Integer.parseInt(json.get("CategoryId").toString());

            lstCategories = categoryManager.getAllSonCategories(categoryId);
        }catch(Exception e){
            e.printStackTrace();
        }

        return lstCategories ;
    }
}
