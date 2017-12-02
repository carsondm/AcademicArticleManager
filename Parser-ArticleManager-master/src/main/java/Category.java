/*
* This program takes in two inputs String Title and String Abstract of an article
* Using the Meaningcloud api it will categorize that text by category and sub category
* To access the information use getCategory() and getSubCategory()
*
* Reason for this class:
* One of the functionality requirements is to be able to categorize article using parsed information.
*
* Programmer: Mark Kenneth Alano
* Date: 11/9/2017
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


public class Category {

    private String APIKEY = null;
    /*Category, Relevance*/
    private ArrayList<Pair<String, Integer>> categories = new ArrayList<>();
    private Pair<String, String> categoryAndSub = null;
    private ArrayList<Pair<String, String>> categoryAndSubArr = new ArrayList<>();

    /*
    * Constructor
    * Any exception found will result category and sub to be null
    * */
    public Category(String title, String body){
        String jsonString = null;
        APIKEY = Keys.MEANINGCLOUD_KEY;
        //body = shortenBody(body);

        try {
            jsonString = requestMeaningCloud(title,body);
            categories = ParseJson(jsonString);

            //System.out.println(jsonString);
            for (int i = 0; i < categories.size(); i++){
                categoryAndSubArr.add(getCategoriesAndSubCategories(categories.get(i)));
            }
            categoryAndSub = categoryAndSubArr.get(0);
        } catch (UnirestException e) {
            e.printStackTrace();
        } catch (ParseException e) {
            e.printStackTrace();
        } catch (NullPointerException e) {
            categories = null;
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }

        //System.out.println(jsonString);
        //System.out.println("Category: " + getCategory() + " Sub-Category: " + getSubCategory());

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
    private ArrayList<Pair<String, Integer>> ParseJson(String json) throws ParseException, NullPointerException{
            //For test only
            //FileReader reader = new FileReader("C:\\Programming\\IdeaProjects\\GroupProject\\ParserMKEA\\src\\main\\resources\\GrobidParser.json");
            ArrayList<Pair<String, Integer>> pairArrayList = new ArrayList<>();

            JSONParser jsonParser = new JSONParser();
            JSONObject jsonObject = (JSONObject) jsonParser.parse(json);

            JSONArray jsonArray = (JSONArray) jsonObject.get("category_list");

            Iterator i = jsonArray.iterator();
            while (i.hasNext()) {
                JSONObject innerObj = (JSONObject) i.next();
                pairArrayList.add(
                        new Pair<String, Integer>(innerObj.get("label").toString(), Integer.parseInt(innerObj.get("relevance").toString())));
            }

            return pairArrayList;
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

    private Pair<String, String> getCategoriesAndSubCategories(Pair<String, Integer> item) throws Exception{
        Pair<String, String> tempPair = new Pair<String, String>();
        String temp = item.getFirst();
        int i;

        if(categories.isEmpty()){
            throw new Exception("NOCATEGORIES");
        }

        for(i = 0; i < temp.length(); i++){
            if(temp.charAt(i) == '>'){
                break;
            }
        }

        if(i != temp.length()){
            tempPair.setFirst(temp.substring(0, i));
            tempPair.setSecond(temp.substring(i+1, temp.length()));
        }else{
            tempPair.setFirst(temp);
            tempPair.setSecond(null);
        }

        return tempPair;
    }


    public String getCategory() throws NullPointerException {
        return categoryAndSub.getFirst();
    }

    public String getSubCategory() throws NullPointerException {
        return categoryAndSub.getSecond();
    }


    /*
    * Returns an arraylist of categories by iterating through the array
    * */
    public ArrayList<String> getCategories() throws NullPointerException{
        ArrayList<String> result = new ArrayList<>();
        for(int i = 0; i < categories.size(); i++){
            result.add(categoryAndSubArr.get(i).getFirst());
        }

        return result;
    }

    /*
    * Returns an arraylist of subcategories by iterating through the array
    * */
    public ArrayList<String> getSubCategories() throws NullPointerException {
        ArrayList<String> result = new ArrayList<>();
        for(int i = 0; i < categories.size(); i++){
            result.add(categoryAndSubArr.get(i).getSecond());
        }

        return result;
    }
}
