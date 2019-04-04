package edu.eci.arsw.collabpaint.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;

import edu.eci.arsw.collabpaint.model.Point;

@Controller
public class DrawController {

		@MessageMapping("/hello")
		@SendTo("/topic/newpoint")
		public Point greeting() throws Exception {
			Thread.sleep(1000); // simulated delay
			return new Point();
		}

	

}

