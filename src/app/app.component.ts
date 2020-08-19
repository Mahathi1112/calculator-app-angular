import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  buttons: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  operators: string[] = ['-', '+', '*', '/', '='];
  expression: any[] = [];

  formValue = this.formBuilder.group({
    expression: this.expression.join('')
  });

  addOperand(value) {
    this.expression.push(value);
    return this.expression.join('');
  }

  addOperator(value) {
    if (this.expression.length !== 0) {
      if (!this.operators.includes(this.expression[this.expression.length - 1])
        && value !== '=') {
        this.expression.push(value);
      }
      if (value === '=') {
        this.expression = this.getResult();
      }
      return this.expression.join('');
    }
  }

  getResult() {
    const postfixExpression = this.convertToPostfix();
    const stack = [];
    let operand1;
    let operand2;
    let intermediateResult;
    postfixExpression.map(element => {
      if (!this.operators.includes(element)) {
        stack.push(element);
      } else {
        operand2 = stack.pop();
        operand1 = stack.pop();
        intermediateResult = this.getIntermediateResult(operand1, element, operand2);
        stack.push(intermediateResult);
      }
    });
    return stack;

  }

  convertToPostfix() {
    const postfixExpression = [];
    let number = [];
    const stack = [];
    this.expression.map(element => {
      if (!this.operators.includes(element)) {
        number.push(element);
      } else {
        postfixExpression.push(parseInt(number.join(''), 10));
        number = [];
        if (this.getPrecendence(stack[stack.length - 1]) >= this.getPrecendence(element)) {
          postfixExpression.push(stack.pop());
          stack.push(element);
          while (stack.length > 1 && this.getPrecendence(stack[stack.length - 1]) <= this.getPrecendence(stack[stack.length - 2])) {
            postfixExpression.push(stack.pop());
          }
        } else {
          stack.push(element);
        }
      }
    });
    postfixExpression.push(parseInt(number.join(''), 10));
    return postfixExpression.concat(stack.reverse());
  }

  getIntermediateResult(operand1, operator, operand2) {
    switch (operator) {
      case '+': return (operand1 + operand2);
      case '-': return (operand1 - operand2);
      case '*': return (operand1 * operand2);
      case '/': return (operand1 / operand2);
    }
  }

  getPrecendence(operator) {
    switch (operator) {
      case '/': return 5;
      case '*': return 5;
      case '-': return 4;
      case '+': return 4;
      default: return 1;
    }
  }

  clear() {
    this.expression = [];
  }

  constructor(private formBuilder: FormBuilder) { }
}
