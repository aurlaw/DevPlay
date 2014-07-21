using System;
using System.Threading.Tasks;
using System.Threading;

namespace SampleNode.Data
{
	public class Tester
	{
		public string Answer { get; set;}
		public Tester ()
		{
		}

		public async Task<object> Perform(dynamic input) {
			this.Answer = "Finished";
			return Task.Factory.StartNew(() => this);
		}
	}
}

