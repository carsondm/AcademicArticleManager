/*
* Programmer: Mark Kenneth Alano
*
*
* */

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import java.util.ArrayList;
import java.util.Iterator;

/**
 * Created by gunbo on 11/9/2017.
 */
public class Category {

    private String APIKEY = null;
    /*Category, Relevance*/
    private ArrayList<Pair<String, Integer>> categories = new ArrayList<>();
    private String category = null;
    private String subCategory = null;

    public static void main(String[] args) {
        Category test = new Category(null,null);

    }

    /*
    * Sets
    *
    * */
    public Category(String title, String body){
        String jsonString = null;
        APIKEY = Keys.MEANINGCLOUD_KEY;
        body = shortenBody(body);

        try {
            ParseJson(requestMeaningCloud(title,body));
        } catch (UnirestException e) {
            e.printStackTrace();
        } catch (ParseException e) {
            e.printStackTrace();
        }


        category = null;
        subCategory = null;
        return;

    }

    /*https://www.meaningcloud.com/developer/text-classification/dev-tools/1.1*/
    private String requestMeaningCloud(String title, String body) throws UnirestException{
        HttpResponse<String> response = Unirest.post("http://api.meaningcloud.com/class-1.1")
                .header("content-type", "application/x-www-form-urlencoded")
                .body("key=" + APIKEY +"&title=" + title + "&txt=" + body + "&model=IAB_en")
                .asString();

        return response.getBody();
    }

    /*https://examples.javacodegeeks.com/core-java/json/java-json-parser-example/*/
    private void ParseJson(String json) throws ParseException{
            //For test only
            //FileReader reader = new FileReader("C:\\Programming\\IdeaProjects\\GroupProject\\ParserMKEA\\src\\main\\resources\\Test.json");

            JSONParser jsonParser = new JSONParser();
            JSONObject jsonObject = (JSONObject) jsonParser.parse(json);

            JSONArray jsonArray = (JSONArray) jsonObject.get("category_list");

            Iterator i = jsonArray.iterator();
            while (i.hasNext()) {
                JSONObject innerObj = (JSONObject) i.next();
                categories.add(
                        new Pair<String, Integer>(innerObj.get("label").toString(), Integer.parseInt(innerObj.get("relevance").toString())));
            }

    }

    /*
    * Shortens the string to < 500 words
    * Reason: API call penalty for using more than 500 words in meaningcloud.com
    * */
    private String shortenBody(String body){
        int whiteSpaceCount = 0;
        int i;

        for (i = 0;i < body.length() && whiteSpaceCount < 500; i++){
            if(body.charAt(i) == ' '){
                whiteSpaceCount++;
            }
        }

        return body.substring(0, i);

    }

    public void getCategoriesAndSubCategories() throws Exception{
        int i;
        String temp = categories.get(0).first;
        if(categories.isEmpty()){
            throw new Exception("NOCATEGORIES");
        }

        for(i = 0; i < temp.length(); i++){
            if(temp.charAt(i) == '>'){
                break;
            }
        }

        category = temp.substring(0, i-1);
        subCategory = temp.substring(i+1, temp.length());

    }

    public String getCategoriesAndSubCategories(int element) throws Exception{

        if(categories.isEmpty()){
            throw new Exception("NOCATEGORIES");
        }



        return null;
    }

}
