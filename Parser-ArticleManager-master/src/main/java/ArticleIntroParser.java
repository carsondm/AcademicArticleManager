/*
*   Parses 1000 words starting from the Introduction
*   Reason: To be used the categorizing
*
* Programmer: Mark Kenneth Alano
* Date: 11/16/2017
*
* */

import org.apache.pdfbox.cos.COSDocument;
import org.apache.pdfbox.io.RandomAccessFile;
import org.apache.pdfbox.pdfparser.PDFParser;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;

import java.io.File;
import java.io.IOException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class ArticleIntroParser {
    /*
   static String path1 = "C:\\Programming\\IdeaProjects\\GroupProject\\AcademicArticleManager-Fork\\src\\main\\resources\\TestFiles(PDF)\\Ahmed_An_Improved_Deep_2015_CVPR_paper.pdf";
   static String path2 = "C:\\Programming\\IdeaProjects\\GroupProject\\AcademicArticleManager-Fork\\src\\main\\resources\\TestFiles(PDF)\\Huang_SALICON_Reducing_the_ICCV_2015_paper.pdf";
   static String path3 = "C:\\Programming\\IdeaProjects\\GroupProject\\AcademicArticleManager-Fork\\src\\main\\resources\\TestFiles(PDF)\\Jayaraman_Learning_Image_Representations_ICCV_2015_paper.pdf";
   static String path4 = "C:\\Programming\\IdeaProjects\\GroupProject\\AcademicArticleManager-Fork\\src\\main\\resources\\TestFiles(PDF)\\about_metadata.pdf";
   static String path5 = "C:\\Programming\\IdeaProjects\\GroupProject\\AcademicArticleManager-Fork\\src\\main\\resources\\TestFiles(PDF)\\UCFDatabase\\06740844.pdf";
   static String path6 = "C:\\Programming\\IdeaProjects\\GroupProject\\AcademicArticleManager-Fork\\src\\main\\resources\\TestFiles(PDF)\\UCFDatabase\\06740844.pdf";
    public static void main(String[] args) {
        ArticleIntroParser articleIntroParser = new ArticleIntroParser(path6);
        System.out.println(articleIntroParser.getArticleIntro());
    }
*/
    private PDFParser parser;
    private PDFTextStripper pdfStripper;
    private PDDocument pdDoc ;
    private COSDocument cosDoc ;

    private String Text ;
    private File file;

    private String PDFText;
    private String articleIntro;
/*
    private int pageCount;
    private String title;
    private ArrayList<String> authors;
    private String subject;
    private String keywords;
    private String creationDate;
*/
    public ArticleIntroParser(String filePath) {
        try {
            PDFText = ToText(filePath);
            articleIntro = parseData(PDFText, 1000);
        } catch (IOException e) {
            e.printStackTrace();
            PDFText = null;
        }


    }

    /*
    Parses the String for words
    Number of words depends on the maxSpaces

    https://www.ntu.edu.sg/home/ehchua/programming/java/Java_Regexe.html*/
    private String parseData(String PDFText, int maxSpaces){
        String regex = "intro";
        int i = 0, j = 0;
        int spaces = 0;
        Pattern pattern = Pattern.compile(regex, Pattern.CASE_INSENSITIVE);

        Matcher matcher = pattern.matcher(PDFText);

        if(matcher.find()){
            i = matcher.start();
        }

        j = i;
        //#ofspaces == #ofwords
        for (; j < PDFText.length();j++){
            if(PDFText.charAt(j) == ' '){
                spaces++;
                if(spaces >= maxSpaces){
                    break;
                }
            }
        }

        return PDFText.substring(i,j);
    }

    /*
    Turns pdf file into text
    https://radixcode.com/pdfbox-example-code-how-to-extract-text-from-pdf-file-with-java*/
    private String ToText(String filePath) throws IOException
    {
        this.pdfStripper = null;
        this.pdDoc = null;
        this.cosDoc = null;

        file = new File(filePath);
        parser = new PDFParser(new RandomAccessFile(file,"r")); // update for PDFBox V 2.0

        parser.parse();
        cosDoc = parser.getDocument();
        pdfStripper = new PDFTextStripper();
        pdDoc = new PDDocument(cosDoc);
        pdDoc.getNumberOfPages();
        pdfStripper.setStartPage(1);
        pdfStripper.setEndPage(2);

        // reading text from page 1 to 10
        // if you want to get text from full pdf file use this code
        // pdfStripper.setEndPage(pdDoc.getNumberOfPages());

        Text = pdfStripper.getText(pdDoc);
        pdDoc.close();

        return Text;
    }

    /*
    * https://pdfbox.apache.org/1.8/cookbook/workingwithmetadata.html
    * Useless
    * */
    /*
    private void extractMetaData()throws IOException{
        PDDocumentInformation information = pdDoc.getDocumentInformation();
        pageCount = pdDoc.getNumberOfPages();
        title = information.getTitle();
        //System.out.println(information.getAuthor());
        subject = information.getSubject();
        //System.out.println(information.getProducer());
        keywords = information.getKeywords();
        try{
            creationDate = information.getCreationDate().toString();
        }catch (NullPointerException e){
            creationDate = null;
        }

        //System.out.println("Page count: " + pageCount + "\ntitle: " + title + "\nsubject: " + subject + "\nkeywords: " + keywords + "\ncreationdate: " + creationDate);
    }
*/

    public String getPDFText() {
        return PDFText;
    }
/*
    public int getPageCount() {
        return pageCount;
    }

    public String getTitle() {
        return title;
    }

    public ArrayList<String> getAuthors() {
        return authors;
    }

    public String getSubject() {
        return subject;
    }

    public String getKeywords() {
        return keywords;
    }

    public String getCreationDate() {
        return creationDate;
    }
*/
    public String getArticleIntro() {
        return articleIntro;
    }
}
